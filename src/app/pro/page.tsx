import Link from "next/link";

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

const paperTrades = [
  {
    symbol: "BTC",
    entry: "Paper entry pending",
    stop: "ATR-based stop preview",
    target: "Next resistance preview",
  },
  {
    symbol: "ETH",
    entry: "Paper entry pending",
    stop: "ATR-based stop preview",
    target: "Next resistance preview",
  },
];

export default function ProPage() {
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
          </div>

          <div className="flex flex-wrap gap-3">
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

        <section className="mt-8 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">
          <strong>Relaunch notice:</strong> Sign-in and checkout are working. Subscription
          syncing is being reconnected, so this Pro dashboard is temporarily visible while
          we reconnect Stripe, Clerk, and Supabase access checks.
        </section>

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
            <div className="text-sm text-slate-400">Bot Data</div>
            <div className="mt-2 text-3xl font-black text-yellow-200">Reconnecting</div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                Pro Signals
              </div>
              <h2 className="mt-2 text-3xl font-black">Top bullish setups</h2>
            </div>

            <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
              Preview mode during relaunch
            </div>
          </div>

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

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-sm text-slate-400">Direction</div>
                    <div className="mt-1 text-xl font-black text-cyan-200">
                      {signal.direction}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-sm text-slate-400">Why this signal?</div>
                    <div className="mt-1 text-slate-200">{signal.reason}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Paper Trades
            </div>
            <h2 className="mt-2 text-3xl font-black">Open paper trade preview</h2>

            <div className="mt-6 space-y-4">
              {paperTrades.map((trade) => (
                <div key={trade.symbol} className="rounded-2xl bg-slate-950/80 p-5">
                  <div className="text-2xl font-black">{trade.symbol}</div>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    <div>Entry: {trade.entry}</div>
                    <div>Stop: {trade.stop}</div>
                    <div>Target: {trade.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
            <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Closed Trade Stats
            </div>
            <h2 className="mt-2 text-3xl font-black">Performance preview</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <div className="text-sm text-slate-400">Win Rate</div>
                <div className="mt-1 text-3xl font-black">Reconnecting</div>
              </div>

              <div className="rounded-2xl bg-slate-950/80 p-5">
                <div className="text-sm text-slate-400">Average Hold</div>
                <div className="mt-1 text-3xl font-black">ATR-based</div>
              </div>

              <div className="rounded-2xl bg-slate-950/80 p-5">
                <div className="text-sm text-slate-400">Risk Mode</div>
                <div className="mt-1 text-3xl font-black">Paper only</div>
              </div>
            </div>
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
