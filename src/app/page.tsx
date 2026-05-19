import Link from "next/link";

const topMovers = [
  { name: "BTC Preview", move: "+2.4%", status: "Watching" },
  { name: "ETH Preview", move: "+1.8%", status: "Watching" },
  { name: "SOL Preview", move: "+3.1%", status: "Momentum" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-cyan-300">Signal Drone AI</div>
            <div className="text-sm text-slate-400">Paper-trading research dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign in
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
            >
              Upgrade
            </Link>

            <Link
              href="/pro"
              className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200"
            >
              Pro
            </Link>
          </div>
        </header>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            Signal Drone AI V4
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Free crypto market preview dashboard.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Signal Drone AI provides educational crypto signal research for paper-trading.
            The free dashboard shows a limited market preview. Pro unlocks deeper signal
            research after subscription access is active.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sign-in"
              className="rounded-2xl border border-cyan-400/40 px-6 py-3 font-bold text-cyan-200"
            >
              Sign in first
            </Link>

            <Link
              href="/pricing"
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-400/20"
            >
              View pricing
            </Link>

            <Link
              href="/pro"
              className="rounded-2xl border border-white/15 px-6 py-3 font-bold text-white"
            >
              Open Pro dashboard
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Paper-trading only. Not financial advice.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Free Section
          </div>

          <h2 className="mt-3 text-4xl font-black">Market Preview</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <div className="text-sm text-slate-400">Market Mode</div>
              <div className="mt-2 text-3xl font-black text-cyan-200">Bullish</div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <div className="text-sm text-slate-400">Volatility</div>
              <div className="mt-2 text-3xl font-black">Medium</div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <div className="text-sm text-slate-400">Bot Activity</div>
              <div className="mt-2 text-3xl font-black">Paper only</div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <h3 className="text-2xl font-black">Top Public Movers</h3>

            <div className="mt-5 space-y-4">
              {topMovers.map((coin, index) => (
                <div
                  key={coin.name}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-5"
                >
                  <div>
                    <div className="text-sm text-slate-400">#{index + 1} Momentum Coin</div>
                    <div className="text-xl font-black">{coin.name}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-cyan-300">{coin.move}</div>
                    <div className="text-sm text-slate-400">{coin.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">
            <strong>Free preview:</strong> exact V4 signal names, confidence score,
            reasoning, full Top 10, and trade stats are Pro features.
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
          <strong>Important disclaimer:</strong> Signal Drone AI is for educational,
          informational, and paper-trading research only. It does not place real trades,
          manage user funds, connect to exchange accounts, or provide financial advice.
        </section>
      </section>
    </main>
  );
}
