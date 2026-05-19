"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

type SubscriptionStatus = {
  signedIn: boolean;
  paid: boolean;
  plan: "pro" | "pro_plus" | "unknown" | null;
  status: string | null;
};

export default function ProPreviewGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const clerkUserId = user?.id;

    if (!isLoaded || !isSignedIn || !clerkUserId) {
      setSubscriptionStatus(null);
      return;
    }

    const safeClerkUserId: string = clerkUserId;
    let cancelled = false;

    async function loadSubscriptionStatus() {
      setLoadingStatus(true);

      try {
        const response = await fetch(
          `/api/subscription-status?clerkUserId=${encodeURIComponent(safeClerkUserId)}`,
          { cache: "no-store" }
        );

        const data = (await response.json()) as SubscriptionStatus;

        if (!cancelled) {
          setSubscriptionStatus(data);
        }
      } catch {
        if (!cancelled) {
          setSubscriptionStatus({
            signedIn: true,
            paid: false,
            plan: null,
            status: "error",
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingStatus(false);
        }
      }
    }

    loadSubscriptionStatus();

    const interval = window.setInterval(loadSubscriptionStatus, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-200">
        Checking sign-in status...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-200">
        <h2 className="mb-2 text-xl font-semibold">Pro Dashboard Locked</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Sign in first. After that, Pro access requires an active Stripe subscription.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-xl bg-white px-4 py-2 font-medium text-black">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  if (loadingStatus && !subscriptionStatus) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-200">
        Checking paid subscription...
      </div>
    );
  }

  if (!subscriptionStatus?.paid) {
    return (
      <div className="rounded-2xl border border-yellow-700/60 bg-yellow-950/30 p-6 text-zinc-100">
        <h2 className="mb-2 text-xl font-semibold">Pro Access Requires Subscription</h2>
        <p className="mb-4 text-sm text-zinc-300">
          You are signed in, but this account does not have an active Pro or Pro Plus subscription yet.
        </p>
        <a
          href="/pricing"
          className="inline-block rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          Go to Pricing
        </a>
        {subscriptionStatus?.status ? (
          <p className="mt-4 text-xs text-zinc-400">
            Current Stripe status: {subscriptionStatus.status}
          </p>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
