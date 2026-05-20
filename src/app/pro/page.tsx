"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AccountBar from "@/components/AccountBar";

type Signal = {
  rank?: number;
  symbol?: string;
  direction?: string;
  confidence?: number | string;
  momentum_score?: number | string;
  pattern_score?: number | string;
  ml_score?: number | string;
  risk?: string;
  reason?: string;
  bot_action?: string;
};

type PaperTrade = {
  symbol?: string;
  entry?: number | string;
  current?: number | string;
  unrealized_pl_percent?: number | string;
  status?: string;
};

type ClosedStats = {
  total_closed_trades?: number;
  wins?: number;
  losses?: number;
  win_rate?: string | number;
  average_gain?: string | number;
  average_loss?: string | number;
};

type ProFeed = {
  best_signal_now?: Signal;
  top_10_signals?: Signal[];
  open_paper_trades?: PaperTrade[];
  closed_trade_stats?: ClosedStats;
  watchlist_alerts?: Signal[];
  last_scan?: string;
};

export default function ProPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  const [feed, setFeed] = useState<ProFeed | null>(null);
  const [feedUpdatedAt, setFeedUpdatedAt] = useState<string>("");
  const [feedSource, setFeedSource] = useState<string>("");
  const [feedError, setFeedError] = useState("");
  const [feedLoading, setFeedLoading] = useState(false);

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

  async function loadFeed() {
    try {
      setFeedLoading(true);
      setFeedError("");

      const res = await fetch("/api/pro-signals", {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Could not load Pro signal feed.");
      }

      setFeed(json.data || null);
      setFeedUpdatedAt(json.updated_at || json.data?.last_scan || "");
      setFeedSource(json.source || "unknown");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Could not load Pro signal feed.";
      setFeedError(errorMessage);
    } finally {
      setFeedLoading(false);
    }
  }

  useEffect(() => {
    checkSubscription();
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    if (active) {
      loadFeed();
      const timer = setInterval(loadFeed, 30000);
      return () => clearInterval(timer);
    }
  }, [active]);

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
              <div>
                <strong>Signed in as:</strong> {email || "No email found"}
              </div>
              <div className="mt-2 break-all">
                <strong>Clerk user ID:</strong> {user?.id}
              </div>
              <div className="mt-2">
                <strong>Status:</strong> {status}
              </div>
              {message && (
                <div className="mt-2">
                  <strong>Message:</strong> {message}
                </div>
              )}
            </div>

            <p className="mt-5 text-yellow-100">
              This account does not currently show an active Pro subscription.
            </p>

            <div className="mt-8 grid gap-4">
              <Link
                href="/pricing"
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
              >
                Subscribe with this signed-in account
              </Link>

              <Link
                href="/sign-in"
                className="rounded-2xl border border-white/15 px-6 py-3 font-black text-white"
              >
                Sign in with a different account
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/15 px-6 py-3 font-black text-white"
              >
                Free dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const best = feed?.best_signal_now;
  const topSignals = feed?.top_10_signals || [];
  const openTrades = feed?.open_paper_trades || [];
  const stats = feed?.closed_trade_stats;
  const alerts = feed?.watchlist_alerts || [];

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
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Live bot feed</div>
              <div className="text-xl font-black">
                {feedSource.includes("supabase") ? "Supabase live feed" : "Local fallback feed"}
              </div>

              <FreshnessBanner updatedAt={feedUpdatedAt} source={feedSource} />
            </div>

            <button
              onClick={loadFeed}
              disabled={feedLoading}
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 disabled:opacity-60"
            >
              {feedLoading ? "Refreshing..." : "Refresh feed"}
            </button>
          </div>

          {feedError && (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">
              {feedError}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Best Signal</div>
            <div className="mt-2 text-3xl font-black text-cyan-200">
              {best?.symbol || "Loading"}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Direction</div>
            <div className="mt-2 text-3xl font-black">
              {best?.direction || "—"}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Confidence</div>
            <div className="mt-2 text-3xl font-black text-green-300">
              {best?.confidence ?? "—"}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Risk</div>
            <div className="mt-2 text-3xl font-black text-yellow-200">
              {best?.risk || "—"}
            </div>
          </div>
        </section>

        {best && (
          <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Best Signal Right Now
            </div>

            <h2 className="mt-2 text-4xl font-black">{best.symbol}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Metric label="ML Score" value={best.ml_score} />
              <Metric label="Momentum" value={best.momentum_score} />
              <Metric label="Pattern Score" value={best.pattern_score} />
              <Metric label="Bot Action" value={best.bot_action} />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-950/80 p-5">
              <div className="text-sm text-slate-400">Why this signal?</div>
              <div className="mt-2 text-lg text-slate-100">{best.reason || "—"}</div>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Pro Top 10
          </div>
          <h2 className="mt-2 text-3xl font-black">Top V4 bullish signal feed</h2>

          <div className="mt-6 space-y-4">
            {topSignals.length === 0 && (
              <div className="rounded-2xl bg-slate-950/80 p-5 text-slate-300">
                No Pro signals loaded yet.
              </div>
            )}

            {topSignals.map((signal, index) => (
              <div
                key={`${signal.symbol}-${index}`}
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-400">
                      #{signal.rank || index + 1} Signal
                    </div>
                    <div className="mt-1 text-3xl font-black">{signal.symbol}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-400">Confidence</div>
                    <div className="text-2xl font-black text-cyan-300">
                      {signal.confidence ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <Metric label="Direction" value={signal.direction} />
                  <Metric label="ML" value={signal.ml_score} />
                  <Metric label="Momentum" value={signal.momentum_score} />
                  <Metric label="Pattern" value={signal.pattern_score} />
                  <Metric label="Risk" value={signal.risk} />
                </div>

                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Reason</div>
                  <div className="mt-1 text-slate-200">{signal.reason || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Open Paper Trades
            </div>
            <h2 className="mt-2 text-3xl font-black">Current simulated positions</h2>

            <div className="mt-6 space-y-4">
              {openTrades.length === 0 && (
                <div className="rounded-2xl bg-slate-950/80 p-5 text-slate-300">
                  No open paper trades.
                </div>
              )}

              {openTrades.map((trade, index) => (
                <div key={`${trade.symbol}-${index}`} className="rounded-2xl bg-slate-950/80 p-5">
                  <div className="text-2xl font-black">{trade.symbol}</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <Metric label="Entry" value={trade.entry} />
                    <Metric label="Current" value={trade.current} />
                    <Metric label="Unrealized P/L %" value={trade.unrealized_pl_percent} />
                  </div>
                  <div className="mt-3 text-sm text-slate-400">
                    Status: {trade.status || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Closed Trade Stats
            </div>
            <h2 className="mt-2 text-3xl font-black">Paper performance</h2>

            <div className="mt-6 grid gap-4">
              <Metric label="Total Closed Trades" value={stats?.total_closed_trades} />
              <Metric label="Wins" value={stats?.wins} />
              <Metric label="Losses" value={stats?.losses} />
              <Metric label="Win Rate" value={stats?.win_rate} />
              <Metric label="Average Gain" value={stats?.average_gain} />
              <Metric label="Average Loss" value={stats?.average_loss} />
            </div>
          </div>
        </section>

        {alerts.length > 0 && (
          <section className="mt-8 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-yellow-200">
              Watchlist Alerts
            </div>

            <div className="mt-5 space-y-3">
              {alerts.map((alert, index) => (
                <div key={`${alert.symbol}-${index}`} className="rounded-2xl bg-black/30 p-4">
                  <div className="text-xl font-black">{alert.symbol}</div>
                  <div className="text-sm text-yellow-100">{alert.reason || alert.direction}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
          <strong>Important disclaimer:</strong> Signal Drone AI is for educational,
          informational, and paper-trading research only. It does not place real trades,
          manage user funds, connect to exchange accounts, or provide financial advice.
        </section>
      </div>
    </main>
  );
}

function FreshnessBanner({
  updatedAt,
  source,
}: {
  updatedAt: string;
  source: string;
}) {
  if (!updatedAt) {
    return (
      <div className="mt-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-yellow-100">
        Feed status unknown. No upload timestamp was found.
      </div>
    );
  }

  const uploadedTime = new Date(updatedAt);
  const now = new Date();
  const ageMs = now.getTime() - uploadedTime.getTime();
  const ageMinutes = Math.max(0, Math.floor(ageMs / 60000));
  const isFresh = ageMinutes <= 3;
  const isSupabase = source.includes("supabase");

  return (
    <div
      className={
        isFresh
          ? "mt-3 rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-green-100"
          : "mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100"
      }
    >
      <div className="text-lg font-black">
        {isFresh ? "Data is fresh ✅" : "Data is stale ⚠️"}
      </div>

      <div className="mt-1 text-sm">
        Last upload: {uploadedTime.toLocaleString()} — about {ageMinutes} minute
        {ageMinutes === 1 ? "" : "s"} ago.
      </div>

      <div className="mt-1 text-sm">
        Source: {isSupabase ? "Render → Supabase live feed" : "Local fallback file"}
      </div>

      {!isSupabase && (
        <div className="mt-2 text-sm font-bold">
          Warning: this is not reading the live Supabase feed yet.
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 break-words text-xl font-black">
        {value === undefined || value === null || value === "" ? "—" : value}
      </div>
    </div>
  );
}
