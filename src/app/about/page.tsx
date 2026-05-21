import Link from "next/link";
import AccountBar from "@/components/AccountBar";
import AppDisclaimer from "@/components/AppDisclaimer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/free" className="text-cyan-300">
            ← Back to dashboard
          </Link>

          <AccountBar />
        </header>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            About Signal Drone AI
          </div>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            A paper-trading crypto signal dashboard built for research.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Signal Drone AI watches crypto market data and organizes simulated
            trading signals into a simple dashboard. It is designed to help users
            study possible bullish setups, compare signal strength, and follow
            paper-trading activity from a bot-powered research system.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <h2 className="text-2xl font-black text-cyan-200">
              What the app does
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              The app scans crypto market data, looks for bullish signal setups,
              and displays signal information such as confidence, direction,
              reasoning, risk level, top signal rankings, watchlist alerts, and
              simulated paper-trade activity.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <h2 className="text-2xl font-black text-cyan-200">
              What paper-trading means
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Paper-trading means the bot is simulating trades for educational
              research. It is not using real money, it is not placing real orders,
              and it is not connected to your personal exchange account.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <h2 className="text-2xl font-black text-cyan-200">
              Free vs Pro
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              The free dashboard gives a limited market preview. The Pro dashboard
              unlocks deeper V4 signal research, including the live Pro signal
              feed, top signal list, confidence details, paper-trade stats, and
              signal reasoning.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
            <h2 className="text-2xl font-black text-cyan-200">
              Who it is for
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Signal Drone AI is for people who want to study crypto signals,
              learn from simulated trading data, and follow market research in a
              simple dashboard without risking real funds through the app.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-yellow-100">
          <h2 className="text-2xl font-black">Important disclaimer</h2>

          <p className="mt-3 leading-7">
            Signal Drone AI is for educational, informational, and paper-trading
            research only. It does not provide financial advice, does not execute
            real trades, does not manage user funds, and does not guarantee profits.
            Crypto trading is risky, and users are responsible for their own
            decisions.
          </p>
        </section>

        <section className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/free"
            className="rounded-2xl border border-white/15 px-6 py-3 font-bold text-white"
          >
            View free dashboard
          </Link>

          <Link
            href="/pricing"
            className="rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-slate-950"
          >
            View Pro pricing
          </Link>

          <Link
            href="/pro"
            className="rounded-2xl border border-cyan-400/40 px-6 py-3 font-bold text-cyan-200"
          >
            Open Pro dashboard
          </Link>
        </section>
      </div>
            <AppDisclaimer />

    </main>
  );
}