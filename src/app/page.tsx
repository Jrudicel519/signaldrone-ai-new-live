import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="text-xl font-bold text-cyan-300">Signal Drone AI</div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
            >
              Get started
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              Signal Drone AI V4
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-6xl">
              AI-powered crypto signal research dashboard.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Signal Drone AI is being relaunched with cleaner sign-in, subscription access,
              and paper-trading research signals. This platform is educational only and does
              not place real trades or manage user funds.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
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
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-6 shadow-2xl">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
              <div className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-300">
                Relaunch status
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">App</div>
                  <div className="text-2xl font-black">Online</div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Subscriptions</div>
                  <div className="text-2xl font-black">Checkout reconnecting</div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Signal data</div>
                  <div className="text-2xl font-black">Paper-trading only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
