"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isSignedIn } = useUser();

  async function startCheckout() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user?.id || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
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
        <Link href="/" className="text-cyan-300">
          ← Back home
        </Link>

        <div className="mt-10 rounded-3xl border border-cyan-400/30 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Signal Drone AI Pro
          </div>

          <h1 className="mt-4 text-5xl font-black">$9.99/month</h1>

          <p className="mt-4 text-slate-300">
            Access bullish-only V4 signal research for paper-trading education.
          </p>

          {!isSignedIn && (
            <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-yellow-100">
              For best results, sign in before subscribing so your payment can be matched
              to your account automatically.
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
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="w-full rounded-2xl border border-cyan-400/40 px-6 py-4 text-center text-lg font-black text-cyan-200"
              >
                Sign in before subscribing
              </Link>
            )}

            <button
              onClick={startCheckout}
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-black text-slate-950 disabled:opacity-60"
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
      </div>
    </main>
  );
}
