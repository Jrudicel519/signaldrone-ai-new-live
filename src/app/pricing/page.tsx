"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AccountBar from "@/components/AccountBar";
import AppDisclaimer from "@/components/AppDisclaimer";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isLoaded, isSignedIn } = useUser();

  async function startCheckout() {
    if (!isSignedIn || !user?.id) {
      setError("Please sign in first so your subscription can connect to your account.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed.");
      }

      if (!data?.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-cyan-300">
            ← Back home
          </Link>
          <AccountBar />
        </div>

        <div className="mt-10 rounded-3xl border border-cyan-400/30 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Signal Drone AI Pro
          </div>

          <h1 className="mt-4 text-5xl font-black">$9.99/month</h1>

          <p className="mt-4 text-slate-300">
            Access bullish-only V4 signal research for paper-trading education.
          </p>

          {!isLoaded && (
            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-cyan-100">
              Checking sign-in status...
            </div>
          )}

          {isLoaded && !isSignedIn && (
            <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-yellow-100">
              You need to sign in before subscribing so Stripe can connect your payment
              to your Signal Drone AI account.
            </div>
          )}

          {isLoaded && isSignedIn && (
            <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-green-100">
              Signed in as {user?.primaryEmailAddress?.emailAddress || "your account"}.
              You can subscribe now.
            </div>
          )}

          <ul className="mt-8 space-y-3 text-slate-200">
            <li>• Bullish-only signal research</li>
            <li>• Best signal preview</li>
            <li>• Confidence score</li>
            <li>• Paper-trading dashboard access</li>
            <li>• Educational use only</li>
          </ul>

          <div className="mt-8 grid gap-3">
            {isLoaded && !isSignedIn && (
              <Link
                href="/sign-in"
                className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-center text-lg font-black text-slate-950"
              >
                Sign in before subscribing
              </Link>
            )}

            <button
              onClick={startCheckout}
              disabled={loading || !isLoaded || !isSignedIn}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Opening Stripe..." : "Subscribe with Stripe"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          <p className="mt-5 text-center text-sm text-slate-400">
            Secure checkout powered by Stripe. Paper-trading only. Not financial advice.
          </p>
        </div>

                <AppDisclaimer />

<footer className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/about" className="text-cyan-300 hover:text-cyan-200">
              About Signal Drone AI
            </a>
            <a href="/free" className="text-slate-400 hover:text-white">
              Free Dashboard
            </a>
            <a href="/pricing" className="text-slate-400 hover:text-white">
              Pricing
            </a>
          </div>
          <p className="mt-3">
            Paper-trading research only. Not financial advice.
          </p>
        </footer>

      </div>
    </main>
  );
}