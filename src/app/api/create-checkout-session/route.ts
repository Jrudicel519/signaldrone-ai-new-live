import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    route: "/api/create-checkout-session",
    status: "ok",
    methodNeededForCheckout: "POST",
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    hasStripePriceId: Boolean(process.env.STRIPE_PRO_PLUS_PRICE_ID),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_PLUS_PRICE_ID;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://signaldroneai.com";

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRO_PLUS_PRICE_ID." },
        { status: 500 }
      );
    }

    let clerkUserId = "";
    let email = "";

    try {
      const body = await req.json();
      clerkUserId = body?.clerkUserId || "";
      email = body?.email || "";
    } catch {
      // No JSON body is okay.
    }

    const stripe = new Stripe(stripeSecretKey);

    const metadata = {
      clerkUserId,
      email,
      plan: "pro",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      customer_email: email || undefined,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}
