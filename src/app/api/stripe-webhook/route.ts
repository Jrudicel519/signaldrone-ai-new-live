import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlanFromPriceId, writeSubscription } from "@/lib/subscriptions_v4";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function getCustomerMetadataFromSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    return {};
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return {};
    }

    return customer.metadata || {};
  } catch (error) {
    console.warn("Could not retrieve Stripe customer metadata:", customerId, error);
    return {};
  }
}

async function saveSubscriptionFromStripeSubscription(
  subscription: Stripe.Subscription,
  fallback?: {
    clerkUserId?: string | null;
    plan?: string | null;
  }
) {
  const customerMetadata = await getCustomerMetadataFromSubscription(subscription);

  const clerkUserId =
    subscription.metadata?.clerkUserId ||
    fallback?.clerkUserId ||
    customerMetadata.clerkUserId ||
    null;

  if (!clerkUserId) {
    console.warn("Subscription missing clerkUserId metadata:", subscription.id);
    return;
  }

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id;
  const planFromMetadata =
    subscription.metadata?.plan ||
    fallback?.plan ||
    customerMetadata.latestPlanRequested;

  const planFromPrice = getPlanFromPriceId(priceId);

  const plan =
    planFromMetadata === "pro" || planFromMetadata === "pro_plus"
      ? planFromMetadata
      : planFromPrice;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  try {
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        ...subscription.metadata,
        clerkUserId,
        plan,
      },
    });
  } catch (error) {
    console.warn("Could not backfill subscription metadata:", subscription.id, error);
  }

  await writeSubscription({
    clerkUserId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    priceId,
    plan,
    status: subscription.status,
    currentPeriodEnd: (subscription as any).current_period_end ?? null,
    updatedAt: new Date().toISOString(),
  });

  console.log(
    "Saved subscription for Clerk user:",
    clerkUserId,
    "status:",
    subscription.status,
    "plan:",
    plan
  );
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkUserId =
          session.metadata?.clerkUserId ||
          session.client_reference_id ||
          null;

        const plan = session.metadata?.plan || null;

        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await saveSubscriptionFromStripeSubscription(subscription, {
            clerkUserId,
            plan,
          });
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await saveSubscriptionFromStripeSubscription(subscription);

        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await saveSubscriptionFromStripeSubscription(subscription);
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
