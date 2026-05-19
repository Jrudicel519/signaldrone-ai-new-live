"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import ManageSubscriptionButton from "../ManageSubscriptionButton";

type SubscriptionStatus = {
  signedIn: boolean;
  paid: boolean;
  plan: "pro" | "pro_plus" | "unknown" | null;
  status: string | null;
  currentPeriodEnd?: number | null;
};

function planLabel(status: SubscriptionStatus | null) {
  if (!status?.paid) return "Free";

  if (status.plan === "pro") return "Pro";
  if (status.plan === "pro_plus") return "Pro Plus";

  return "Paid";
}

function statusLabel(status: SubscriptionStatus | null) {
  if (!status) return "Checking...";
  if (!status.signedIn) return "Signed out";
  if (!status.status) return "No active subscription";
  return status.status;
}

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      setSubscriptionStatus(null);
      return;
    }

    let cancelled = false;

    async function loadSubscriptionStatus() {
      setLoadingStatus(true);

      try {
        const response = await fetch(
          `/api/subscription-status?clerkUserId=${encodeURIComponent(userId || "")}`,
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

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          Loading account...
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="mb-3 text-2xl font-bold">Account</h1>
          <p className="mb-5 text-zinc-400">
            Sign in to view your CryptoDrone AI account and subscription status.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-xl bg-white px-4 py-2 font-semibold text-black">
              Sign In
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress || "No email found";
  const paid = Boolean(subscriptionStatus?.paid);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage your CryptoDrone AI access.
            </p>
          </div>
          <UserButton />
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Profile</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-zinc-400">Email:</span>{" "}
              <span className="font-medium">{email}</span>
            </p>
            <p>
              <span className="text-zinc-400">Clerk User ID:</span>{" "}
              <span className="font-mono text-xs">{userId}</span>
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Subscription</h2>

          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Plan</p>
              <p className="mt-1 text-2xl font-bold">
                {loadingStatus && !subscriptionStatus ? "Checking..." : planLabel(subscriptionStatus)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Access</p>
              <p className="mt-1 text-2xl font-bold">
                {paid ? "Unlocked" : "Free"}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Stripe Status</p>
              <p className="mt-1 text-lg font-semibold">
                {statusLabel(subscriptionStatus)}
              </p>
            </div>
          </div>

          {paid ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Your Pro access is active. Use the billing portal to manage payment methods,
                invoices, or cancellation.
              </p>
              <ManageSubscriptionButton />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                You are currently on the Free plan. Upgrade to unlock Pro signals and full dashboard access.
              </p>
              <a
                href="/pricing"
                className="inline-block rounded-xl bg-white px-4 py-2 font-semibold text-black"
              >
                View Pricing
              </a>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-yellow-700/60 bg-yellow-950/30 p-6">
          <h2 className="mb-2 text-lg font-semibold">Paper-Trading Only</h2>
          <p className="text-sm text-zinc-300">
            CryptoDrone AI is for paper-trading education, signal research, and market dashboards.
            It is not financial advice and does not place real-money trades.
          </p>
        </section>
      </div>
    </main>
  );
}
