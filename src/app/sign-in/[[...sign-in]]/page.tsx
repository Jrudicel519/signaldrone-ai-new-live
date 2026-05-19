import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <a
            href="/"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-900"
          >
            Back to Dashboard
          </a>

          <a
            href="/pricing"
            className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-200 hover:bg-yellow-500/20"
          >
            View Pricing
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-cyan-300">
              Crypto Signal Lab V4
            </p>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Sign in to access your signal dashboard.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Free users can view the limited market preview. Pro users will
              eventually unlock exact bullish signals, ML score, reasoning, full
              Top 10, paper trades, and closed trade stats.
            </p>

            <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
              <strong>Paper-only disclaimer:</strong> This app is for
              educational, informational, and paper-trading research only. It
              does not place real trades or provide financial advice.
            </div>
          </div>

          <div className="flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
