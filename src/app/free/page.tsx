import HeaderAuthButton from '../HeaderAuthButton';
import fs from "fs";
import path from "path";
import { readSignalforgeV4Data } from "@/lib/signalforge_v4_data";

function safeReadJsonFile(filePath: string, fallback: any) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Could not read JSON file:", filePath, error);
    return fallback;
  }
}

const fallbackFreePreview = {
  generated_at: null,
  updated_at: null,
  stale: true,
  market_summary: {
    status: "waiting",
    message: "Waiting for fresh V4 bot data.",
  },
  top_movers: [],
  preview_signals: [],
  most_active_coin: {
    symbol: "WAITING",
    confidence: 0,
    direction: "Waiting",
  },
  delayed_signal_preview: {
    symbol: "WAITING",
    confidence: 0,
    direction: "Waiting",
    delay: "Waiting for fresh V4 bot data",
    reasoning: "Waiting for fresh V4 bot data.",
    risk: "N/A",
  },
};

const fallbackProSignals = {
  generated_at: null,
  updated_at: null,
  stale: true,
  best_signal: null,
  top_10_signals: [],
  bullish_top_10: [],
  open_trades: [],
  closed_trade_stats: {},
  message: "Waiting for fresh V4 bot data.",
};
import type { ReactNode } from "react";
import AutoRefresh from "../AutoRefresh";
import ProPreviewGate from '../ProPreviewGate';
import FreeDashboardAccessGate from './../FreeDashboardAccessGate';
export const dynamic = "force-dynamic";

type FreeMarketPreview = {
  market_mode: string;
  volatility: string;
  bot_activity: string;
  last_scan: string;
  top_movers: {
    symbol: string;
    change_24h: number;
  }[];
  most_active_coin: {
    symbol: string;
    reason: string;
  };
  delayed_signal_preview: {
    symbol: string;
    direction: string;
    delay: string;
    result: string;
  };
  free_message: string;
};

type ProSignal = {
  rank: number;
  symbol: string;
  direction: string;
  confidence: number;
  momentum_score: number;
  pattern_score: number;
  ml_score: number;
  risk: string;
  reason?: string;
};

type ProSignals = {
  best_signal_now: {
    symbol: string;
    direction: string;
    confidence: number;
    risk: string;
    reason: string;
    bot_action: string;
  };
  top_10_signals: ProSignal[];
  open_paper_trades: {
    symbol: string;
    entry: number;
    current: number;
    unrealized_pl_percent: number;
    status: string;
  }[];
  closed_trade_stats: {
    total_closed_trades: number;
    wins: number;
    losses: number;
    win_rate: string;
    average_gain: string;
    average_loss: string;
  };
  watchlist_alerts: {
    symbol: string;
    status: string;
    reason: string;
  }[];
};

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), "bot_output_v4", fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as T;
}

function isBullishOrLong(signal: ProSignal) {
  const direction = String((signal?.direction || "Waiting") || "").toLowerCase();
  return (
    direction.includes("bullish") ||
    direction.includes("long") ||
    direction.includes("long_idea")
  );
}

function getSignalReason(signal: ProSignal) {
  if (signal?.reason && signal.reason.trim().length > 0) {
    return signal.reason || "V4 signal detected.";
  }

  const reasons = [];

  if (signal.confidence >= 70) {
    reasons.push(`High confidence at ${signal.confidence}%.`);
  }

  if (signal.momentum_score >= 60) {
    reasons.push(`Momentum score is strong at ${signal.momentum_score}.`);
  }

  if (signal.pattern_score > 0) {
    reasons.push(`Bullish pattern strength is present.`);
  }

  if (signal.ml_score >= 65) {
    reasons.push(`ML score is above the current minimum.`);
  }

  if (reasons.length === 0) {
    reasons.push("This coin is on the V4 bullish watchlist.");
  }

  return reasons.join(" ");
}

function getFreeCoinLabel(index: number, isProPreview: boolean, realSymbol: string) {
  if (isProPreview) {
    return realSymbol;
  }

  return `#${index + 1} Momentum Coin`;
}

function getFreeMostActiveLabel(isProPreview: boolean, realSymbol: string) {
  if (isProPreview) {
    return realSymbol;
  }

  return "Top Momentum Coin";
}

function getFreeDelayedSignalLabel(isProPreview: boolean, realSymbol: string) {
  if (isProPreview) {
    return realSymbol;
  }

  return "Delayed Pro Signal";
}

function getStaleStatus(lastScan: string) {
  const date = new Date(lastScan);
  const isBadDate = Number.isNaN(date.getTime());

  if (isBadDate) {
    return {
      isStale: true,
      message: "Last scan time could not be read. Check the export bridge.",
    };
  }

  const ageMs = Date.now() - date.getTime();
  const ageMinutes = Math.floor(ageMs / 60000);

  if (ageMinutes >= 5) {
    return {
      isStale: true,
      message: `Warning: data may be stale. Last scan was about ${ageMinutes} minutes ago.`,
    };
  }

  return {
    isStale: false,
    message: `Data is fresh. Last scan was about ${Math.max(ageMinutes, 0)} minute(s) ago.`,
  };
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function PaidCard({
  title,
  isUnlocked,
  children,
}: {
  title: string;
  isUnlocked: boolean;
  children: ReactNode;
}) {
  if (isUnlocked) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
            Pro Dashboard
          </span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />
      <div className="relative opacity-35">
        <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-5 text-center shadow-xl">
          <p className="text-lg font-black text-white">Pro Locked</p>
          <p className="mt-2 max-w-xs text-sm text-slate-300">
            Upgrade to unlock live bullish-only V4 signals, ML score, reasoning,
            and the full Top 10.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ pro?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isProPreview = false;

  const freeData = await readSignalforgeV4Data<FreeMarketPreview>("free_market_preview", "free_market_preview.json");
  const proData = await readSignalforgeV4Data<ProSignals>("pro_signals", "pro_signals.json");

  const staleStatus = getStaleStatus(freeData.last_scan);

  const bullishSignals = proData.top_10_signals
    ?.filter(isBullishOrLong) ?? []
    .sort((a: any, b: any) => Number(b.confidence || 0) - Number(a.confidence || 0));

  const bestBullishSignal = bullishSignals[0];

  return (
    <FreeDashboardAccessGate>
      <main className="min-h-screen bg-slate-950 text-slate-100">
      <AutoRefresh />
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <img
          src="/signaldrone-hero.png"
          alt="Signal Drone AI hero banner"
          className="w-full rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
        />
      </section>


      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Crypto Signal Lab V4
            </p>

            <p className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              Paper Trading Only
            </p>

            {isProPreview ? (
              <p className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                Pro Dashboard Mode
              </p>
            ) : (
              <p className="inline-block rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300">
                Free Dashboard
              </p>
            )}
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            V4 AI crypto signal dashboard for paper-trading research.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Free users get market movement and delayed previews. Pro users
            unlock live bullish-only V4-ranked signals, confidence scores, ML
            score, bot reasoning, paper trades, closed trade stats, and
            watchlist alerts.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/"
              className={`rounded-xl px-6 py-3 text-center font-bold ${
                !isProPreview
                  ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  : "border border-slate-700 text-white hover:bg-slate-900"
              }`}
            >
              Free Dashboard
            </a>
            <a
              href="/pro"
              className={`rounded-xl px-6 py-3 text-center font-bold ${
                isProPreview
                  ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  : "border border-slate-700 text-white hover:bg-slate-900"
              }`}
            >
              Pro Dashboard
            </a>

            <a
              href="/pricing"
              className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-6 py-3 text-center font-bold text-yellow-200 hover:bg-yellow-500/20"
            >
              View Pricing
            </a>

            <HeaderAuthButton />
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
            <strong>Paper-only disclaimer:</strong> This app shows paper-trading
            research signals only. It does not place real trades, does not manage
            real money, and does not provide financial advice. Crypto trading is
            risky. No guaranteed profits.
          </div>
        </div>

        {staleStatus.isStale && (
          <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-100">
            {staleStatus.message}
          </div>
        )}

        {!staleStatus.isStale && (
          <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-100">
            {staleStatus.message}
          </div>
        )}

        <section id="free-preview" className="mb-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                Free Section
              </p>
              <h2 className="text-3xl font-black text-white">
                Market Preview
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Last scan: {freeData.last_scan}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Market Mode" value={freeData.market_mode} />
            <StatCard label="Volatility" value={freeData.volatility} />
            <StatCard label="Bot Activity" value={freeData.bot_activity} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:col-span-2">
              <h3 className="mb-4 text-xl font-bold text-white">
                Top Public Movers
              </h3>
              <div className="space-y-3">
                {(freeData.top_movers || []).map((coin, index) => (
                  <div
                    key={coin.symbol || "WAITING"}
                    className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4"
                  >
                    <span className="font-bold text-white">{getFreeCoinLabel(index, isProPreview, (coin?.symbol || "WAITING"))}</span>
                    <span className="font-black text-cyan-300">
                      {coin.change_24h >= 0 ? "+" : ""}
                      {coin.change_24h}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Free users can see market movement, but exact coin names,
                live rankings, ML score, and full reasoning are reserved for Pro.
              </p>

              {!isProPreview && (
                <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                  Coin names are hidden in Free Dashboard. Pro unlocks exact bullish
                  signal names, ML score, and full V4 reasoning.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="mb-4 text-xl font-bold text-white">
                Most Active Coin
              </h3>
              <p className="text-3xl font-black text-cyan-300">
                {getFreeMostActiveLabel(isProPreview, (freeData.most_active_coin?.symbol || "WAITING"))}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {isProPreview
                  ? freeData.most_active_coin?.reason
                  : "A high-momentum coin is active right now. Unlock Pro to see the exact coin and full reasoning."}
              </p>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">
                  Delayed Signal Preview
                </p>
                <p className="mt-2 font-bold text-white">
                  {getFreeDelayedSignalLabel(isProPreview, (freeData.delayed_signal_preview?.symbol || "WAITING"))} —{" "}
                  {freeData.delayed_signal_preview?.direction || "Waiting"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Delay: {(freeData.delayed_signal_preview?.delay || "Waiting for fresh V4 bot data")}
                </p>
                <p className="mt-1 text-sm text-cyan-300">
                  Result: {freeData.delayed_signal_preview?.result || "Pending"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-cyan-100">
            {freeData.free_message}
            {!isProPreview && (
              <p className="mt-3 text-sm text-cyan-200">
                Free Dashboard is intentionally limited: live coin names, ML score,
                exact ranking, and full V4 signal reasoning are protected for
                paid subscribers.
              </p>
            )}
          </div>
        </section>

        
      </section>
      </main>
    </FreeDashboardAccessGate>
  );
}
