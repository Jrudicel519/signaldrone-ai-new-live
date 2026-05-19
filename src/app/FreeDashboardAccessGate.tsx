"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";

type SubscriptionStatus = {
  signedIn: boolean;
  paid: boolean;
  plan: "pro" | "pro_plus" | "unknown" | null;
  status: string | null;
};

export default function FreeDashboardAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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

          if (data?.paid) {
            router.replace("/pro");
          }
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
  }, [isLoaded, isSignedIn, user?.id, router]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
          Loading...
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
            <div className="mb-6">
              <img
                src="/signaldrone-hero.png"
                alt="Signal Drone AI hero banner"
                className="w-full rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
              />
            </div>

            <p className="mb-3 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Signal Drone AI V4
            </p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Sign in to view the dashboard.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Create or sign in to your account to view the Signal Drone AI paper-trading research dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <SignInButton mode="modal" forceRedirectUrl="/free">
                <button className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-slate-950 hover:bg-emerald-400">
                  Sign In
                </button>
              </SignInButton>

              <Link
                href="/pricing"
                className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-6 py-3 text-center font-bold text-yellow-200 hover:bg-yellow-500/20"
              >
                View Pricing
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
            <strong>Paper-only disclaimer:</strong> Signal Drone AI is for educational and informational paper-trading research only.
            No real trades are executed. No user funds are managed. No profit guarantees. Not financial advice.
          </section>
        </div>
      </main>
    );
  }

  if (loadingStatus || subscriptionStatus?.paid) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-cyan-100">
          Checking access...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
