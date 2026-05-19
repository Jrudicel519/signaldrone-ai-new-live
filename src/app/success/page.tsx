import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">
          Subscription Started
        </p>

        <h1 className="mb-4 text-4xl font-black">
          Payment successful.
        </h1>

        <p className="mb-8 text-slate-300">
          Your Stripe subscription checkout completed. Next we will connect
          Stripe webhooks so Pro access is unlocked automatically based on
          subscription status.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/?pro=1"
            className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 hover:bg-emerald-300"
          >
            Go to Pro Dashboard
          </Link>

          <Link
            href="/account"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-900"
          >
            Account
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-900"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
          <strong>Paper-only disclaimer:</strong> CryptoDrone AI is for
          educational, informational, and paper-trading research only. It does
          not place real trades, does not manage real money, and does not
          provide financial advice.
        </div>
      </div>
    </main>
  );
}
