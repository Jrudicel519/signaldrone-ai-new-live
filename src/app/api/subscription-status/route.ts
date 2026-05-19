import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clerkUserId = url.searchParams.get("clerkUserId");

    if (!clerkUserId) {
      return NextResponse.json({
        active: false,
        status: "missing_clerk_user_id",
        message: "No Clerk user ID was provided.",
      });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("subscriptions_v4")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .in("status", ["active", "trialing"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        active: false,
        status: "not_found",
        message: "No active subscription found for this Clerk user.",
      });
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const periodEnd = data.current_period_end
      ? Number(data.current_period_end)
      : null;

    const periodStillValid = !periodEnd || periodEnd > nowSeconds;

    return NextResponse.json({
      active: periodStillValid,
      status: data.status,
      plan: data.plan || "pro",
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end,
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return NextResponse.json(
      {
        active: false,
        status: "error",
        message: "Could not check subscription status.",
      },
      { status: 500 }
    );
  }
}
