"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AccountBar from "@/components/AccountBar";

const topSignals = [
  {
    rank: 1,
    symbol: "BTC Preview",
    confidence: "High",
    direction: "Bullish",
    reason: "Momentum remains strong while volatility is controlled.",
  },
  {
    rank: 2,
    symbol: "ETH Preview",
    confidence: "Medium",
    direction: "Bullish",
    reason: "Trend strength is improving with steady market participation.",
  },
  {
    rank: 3,
    symbol: "SOL Preview",
    confidence: "Medium",
    direction: "Bullish",
    reason: "Short-term momentum is positive but requires confirmation.",
  },
];

export default function ProPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [reconnecting, setReconnecting] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress || "";

  async function checkSubscription() {
    if (!isLoaded) return;

    if (!isSignedIn || !user?.id) {
      setActive(false);
      setStatus("not_signed_in");
      setChecking(false);
      return;
    }

    try {
      setChecking(true);

      const res = await fetch(
        `/api/subscription-status?clerkUserId=${encodeURIComponent(user.id)}`
      );

      const data = await res.json();

      setActive(Boolean(data.active));
      setStatus(data.status || "unknown");
      setMessage(data.message || "");
    } catch {
      setActive(false);
      setStatus("error");
      setMessage("Could not check subscription.");
    } finally {
      setChecking(false);
    }
  }

  async function reconnectSubscription() {
    if (!user?.id || !email) {
      setMessage("Missing signed-in account email.");
      return;
    }

    try {
      setReconnecting(true);
      setMessage("");

      const res = await fetch("/api/reconnect-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          email,
        }),
      });

      const data = await res.json();

      setMessage(data.message || data.error || "Reconnect finished.");
      setStatus(data.status || "unknown");

      if (data.active) {
        setActive(true);
      }
    } catch {
      setMessage("Reconnect failed.");
    } finally {
      setReconnecting(false);
    }
  }

  useEffect(() => {
    checkSubscription();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded || checking) {
    return (
      <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-black">Checking Pro access...</h1>
            <p className="mt-4 text-slate-300">Please wait a moment.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center text-center">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <h1 className="text-5xl font-black">Sign in to access Pro.</h1>
            <p className="mt-5 text-slate-300">
              Please sign in first so Signal Drone AI can check your subscription.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-in"
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
              >
                Sign in
              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl border border-white/15 px-6 py-3 font-black text-white"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!active) {
    return (
      <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center text-center">
          <div className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8">
            <h1 className="text-5xl font-black">Pro subscription not connected.</h1>

            <div className="mt-6 rounded-2xl bg-black/30 p-5 text-left text-sm text-yellow-100">
              <div><strong>Signed in as:</strong> {email || "No email found"}</div>
              <div className="mt-2 break-all"><strong>Clerk user ID:</strong> {user?.id}</div>
              <div className="mt-2"><strong>Status:</strong> {status}</div>
              {message && <div className="mt-2"><strong>Message:</strong> {message}</div>}
            </div>

            <p className="mt-5 text-yellow-100">
              If you already subscribed using this same email, click reconnect.
              If you subscribed with a different email, sign in with that email or use that
              email for Stripe.
            </p>

            <div className="mt-8 grid gap-4">
              <button
                onClick={reconnectSubscription}
                disabled={reconnecting}
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950 disabled:opacity-60"
              >
                {reconnecting ? "Reconnecting..." : "Reconnect my existing subscription"}
              </button>

              <Link
                href="/pricing"
                className="rounded-2xl border border-cyan-400/40 px-6 py-3 font-black text-cyan-200"
              >
                Subscribe with this signed-in account
              </Link>

              <Link
                href="/sign-in"
                className="rounded-2xl border border-white/15 px-6 py-3 font-black text-white"
              >
                Sign in with a different account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Signal Drone AI Pro
            </div>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              V4 Pro Signal Dashboard
            </h1>
            <p className="mt-3 text-cyan-200">
              Pro access active ✅ Signed in as {email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AccountBar />
            <Link
              href="/"
              className="rounded-2xl border border-white/15 px-5 py-3 font-bold text-white"
            >
              Free dashboard
            </Link>

            <Link
              href="/pricing"
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
            >
              Pricing
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Market Mode</div>
            <div className="mt-2 text-3xl font-black text-cyan-200">Bullish</div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Signal Type</div>
            <div className="mt-2 text-3xl font-black">Long only</div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Trading Mode</div>
            <div className="mt-2 text-3xl font-black">Paper</div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Subscription</div>
            <div className="mt-2 text-3xl font-black text-green-300">Active</div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Pro Signals
          </div>
          <h2 className="mt-2 text-3xl font-black">Top bullish setups</h2>

          <div className="mt-6 space-y-4">
            {topSignals.map((signal) => (
              <div
                key={signal.rank}
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-400">#{signal.rank} Pro Signal</div>
                    <div className="mt-1 text-3xl font-black">{signal.symbol}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-400">Confidence</div>
                    <div className="text-2xl font-black text-cyan-300">
                      {signal.confidence}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Why this signal?</div>
                  <div className="mt-1 text-slate-200">{signal.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
          <strong>Important disclaimer:</strong> Signal Drone AI is for educational,
          informational, and paper-trading research only. It does not place real trades,
          manage user funds, connect to exchange accounts, or provide financial advice.
        </section>
      </div>
    </main>
  );
}