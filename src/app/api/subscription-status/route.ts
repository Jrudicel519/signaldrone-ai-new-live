import { NextResponse } from "next/server";
import {
  getSubscriptionByClerkUserId,
  isPaidSubscription,
} from "@/lib/subscriptions_v4";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clerkUserId = url.searchParams.get("clerkUserId");

  if (!clerkUserId) {
    return NextResponse.json({
      signedIn: false,
      paid: false,
      plan: null,
      status: null,
    });
  }

  const subscription = await getSubscriptionByClerkUserId(clerkUserId);
  const paid = isPaidSubscription(subscription?.status);

  return NextResponse.json({
    signedIn: true,
    paid,
    plan: paid ? subscription?.plan || "unknown" : null,
    status: subscription?.status || null,
    currentPeriodEnd: subscription?.currentPeriodEnd || null,
  });
}
