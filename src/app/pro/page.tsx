import Link from "next/link";

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-white/15 px-5 py-3 font-bold text-white"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/pricing"
            className="rounded-2xl border border-yellow-400/50 px-5 py-3 font-bold text-yellow-200"
          >
            View Pricing
          </Link>
        </div>

        <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Crypto Signal Lab V4
          </div>

          <h1 className="mt-5 text-5xl font-black leading-tight">
            Sign in to access your signal dashboard.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Free users can view the limited market preview. Pro users will unlock bullish-only
            signal research, ML score, reasoning, full Top 10, paper trades, and closed trade stats.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sign-in"
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-2xl border border-cyan-400/40 px-6 py-3 font-black text-cyan-200"
            >
              Create account
            </Link>

            <Link
              href="/pricing"
              className="rounded-2xl border border-yellow-400/40 px-6 py-3 font-black text-yellow-200"
            >
              Subscribe
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">
            <strong>Paper-only disclaimer:</strong> This app is for educational,
            informational, and paper-trading research only. It does not place real trades
            or provide financial advice.
          </div>
        </section>
      </div>
    </main>
  );
}
