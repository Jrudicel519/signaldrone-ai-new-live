import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    route: "/api/create-customer-portal-session",
    status: "ok",
    methodNeededForPortal: "POST",
    note: "Customer portal requires a Stripe customer ID before it can fully work.",
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Customer portal is not fully connected yet because Stripe customer IDs are not matched to signed-in users.",
    },
    { status: 503 }
  );
}
