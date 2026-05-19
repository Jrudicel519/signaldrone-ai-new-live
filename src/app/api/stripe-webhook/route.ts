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
    route: "/api/stripe-webhook",
    status: "ok",
    methodNeededForStripe: "POST",
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    hasStripeWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    hasSupabaseUrl: Boolean(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}

async function upsertSubscriptionFromStripe(
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  const supabase = getSupabase();

  const subscriptionAny = subscription as any;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const customer = await stripe.customers.retrieve(customerId);

  let customerEmail: string | null = null;

  if (!customer.deleted) {
    customerEmail = customer.email || null;
  }

  const clerkUserId = subscription.metadata?.clerkUserId || null;
  const metadataEmail = subscription.metadata?.email || null;
  const email = metadataEmail || customerEmail;
  const priceId = subscription.items.data[0]?.price?.id || null;

  const currentPeriodEnd = subscriptionAny.current_period_end
    ? subscriptionAny.current_period_end
    : null;

  const { error } = await supabase.from("subscriptions_v4").upsert(
    {
      clerk_user_id: clerkUserId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      price_id: priceId,
      plan: "pro",
      status: subscription.status,
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

  console.log("Saved subscription to Supabase:", {
    clerkUserId,
    email,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json(
        { error: "Stripe webhook is not fully configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log("Stripe webhook received:", event.type);

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscriptionFromStripe(stripe, subscription);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscriptionFromStripe(stripe, subscription);
      }
    }

    return NextResponse.json({
      received: true,
      eventType: event.type,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      { error: "Stripe webhook failed." },
      { status: 400 }
    );
  }
}
