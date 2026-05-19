import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase URL or service role key.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  return NextResponse.json({
    route: "/api/reconnect-subscription",
    status: "ok",
    methodNeeded: "POST",
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const clerkUserId = body?.clerkUserId;
    const email = body?.email;

    if (!clerkUserId || !email) {
      return NextResponse.json(
        { error: "Missing Clerk user ID or email." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabase = getSupabase();

    const customers = await stripe.customers.list({
      email,
      limit: 10,
    });

    if (!customers.data.length) {
      return NextResponse.json({
        active: false,
        status: "no_stripe_customer_found",
        message: "No Stripe customer was found for this signed-in email.",
      });
    }

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 10,
      });

      const activeSub = subscriptions.data.find((sub) =>
        ["active", "trialing"].includes(sub.status)
      );

      if (activeSub) {
        const subAny = activeSub as any;

        const priceId = activeSub.items.data[0]?.price?.id || null;
        const currentPeriodEnd = subAny.current_period_end || null;

        const { error } = await supabase.from("subscriptions_v4").upsert(
          {
            clerk_user_id: clerkUserId,
            stripe_customer_id: customer.id,
            stripe_subscription_id: activeSub.id,
            price_id: priceId,
            plan: "pro",
            status: activeSub.status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "stripe_subscription_id",
          }
        );

        if (error) {
          throw error;
        }

        return NextResponse.json({
          active: true,
          status: activeSub.status,
          message: "Subscription reconnected successfully.",
          stripeCustomerId: customer.id,
          stripeSubscriptionId: activeSub.id,
        });
      }
    }

    return NextResponse.json({
      active: false,
      status: "no_active_subscription_found",
      message:
        "Stripe customer exists, but no active subscription was found for this email.",
    });
  } catch (error) {
    console.error("Reconnect subscription error:", error);

    return NextResponse.json(
      {
        active: false,
        status: "error",
        error: "Could not reconnect subscription.",
      },
      { status: 500 }
    );
  }
}
