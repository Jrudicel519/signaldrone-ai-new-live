import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-yellow-300">
          Checkout Canceled
        </p>

        <h1 className="mb-4 text-4xl font-black">
          No subscription was started.
        </h1>

        <p className="mb-8 text-slate-300">
          You can return to pricing and try again whenever you are ready.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/pricing"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
          >
            Back to Pricing
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
