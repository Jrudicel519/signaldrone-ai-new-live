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
            Back home
          </Link>

          <Link
            href="/pricing"
            className="rounded-2xl border border-yellow-400/50 px-5 py-3 font-bold text-yellow-200"
          >
            View pricing
          </Link>
        </div>

        <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-8">
          <div className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Crypto Signal Lab V4
          </div>

          <h1 className="mt-5 text-5xl font-black leading-tight">
            Pro dashboard is being reconnected.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Checkout is active. Pro access and subscription syncing are being reconnected
            during this relaunch. The app remains paper-trading only and educational.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pricing"
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
            >
              Subscribe
            </Link>

            <Link
              href="/signin"
              className="rounded-2xl border border-cyan-400/40 px-6 py-3 font-black text-cyan-200"
            >
              Sign in
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
