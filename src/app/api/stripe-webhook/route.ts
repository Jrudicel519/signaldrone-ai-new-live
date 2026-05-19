import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY");
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );

      console.log("Stripe webhook received:", event.type);

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook verification failed:", error);

      return NextResponse.json(
        { error: "Invalid Stripe webhook signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Stripe webhook route error:", error);

    return NextResponse.json(
      { error: "Stripe webhook failed" },
      { status: 500 }
    );
  }
}
