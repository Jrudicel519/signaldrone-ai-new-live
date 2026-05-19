import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    route: "/api/subscription-status",
    status: "ok",
    active: false,
    subscriptionStatus: "relaunching",
    message:
      "Subscription syncing is reachable, but Clerk/Stripe/Supabase matching still needs to be reconnected.",
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
    hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}
