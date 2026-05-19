import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in to subscribe." },
        { status: 401 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_PLUS_PRICE_ID;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
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
