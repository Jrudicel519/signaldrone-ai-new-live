import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

type CheckoutRequestBody = {
  plan?: "pro" | "pro_plus";
  clerkUserId?: string;
  email?: string;
};

async function findOrCreateCustomer({
  email,
  clerkUserId,
  plan,
}: {
  email?: string;
  clerkUserId: string;
  plan: "pro" | "pro_plus";
}) {
  let existingCustomer: Stripe.Customer | null = null;

  if (email) {
    const customers = await stripe.customers.list({
      email,
      limit: 10,
    });

    existingCustomer =
      customers.data.find(
        (customer) => customer.metadata?.clerkUserId === clerkUserId
      ) ||
      customers.data[0] ||
      null;
  }

  if (existingCustomer) {
    return await stripe.customers.update(existingCustomer.id, {
      email: email || existingCustomer.email || undefined,
      metadata: {
        ...existingCustomer.metadata,
        clerkUserId,
        latestPlanRequested: plan,
      },
    });
  }

  return await stripe.customers.create({
    email: email || undefined,
    metadata: {
      clerkUserId,
      latestPlanRequested: plan,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;

    const clerkUserId = body.clerkUserId;
    const email = body.email || undefined;
    const plan = body.plan === "pro_plus" ? "pro_plus" : "pro";

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

    const priceId =
      plan === "pro_plus"
        ? process.env.STRIPE_PRO_PLUS_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID in .env.local" },
        { status: 500 }
      );
    }

    const customer = await findOrCreateCustomer({
      email,
      clerkUserId,
      plan,
    });

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://127.0.0.1:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      client_reference_id: clerkUserId,
      metadata: {
        clerkUserId,
        plan,
      },
      subscription_data: {
        metadata: {
          clerkUserId,
          plan,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}
