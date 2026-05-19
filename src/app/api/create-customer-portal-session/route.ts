import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeCustomerIdByClerkUserId } from "@/lib/subscriptions_v4";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

type PortalRequestBody = {
  clerkUserId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as PortalRequestBody;
    const clerkUserId = body.clerkUserId;

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Missing Clerk user ID. Please sign in again." },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY in .env.local" },
        { status: 500 }
      );
    }

    const stripeCustomerId = await getStripeCustomerIdByClerkUserId(clerkUserId);

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this account yet." },
        { status: 404 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://127.0.0.1:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe customer portal error:", error);

    return NextResponse.json(
      { error: "Could not open billing portal." },
      { status: 500 }
    );
  }
}
