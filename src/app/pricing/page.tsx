import Link from 'next/link';
import CheckoutButton from '../CheckoutButton';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-300">
              CryptoDrone AI Pricing
            </p>
            <h1 className="text-4xl font-black md:text-5xl">
              Choose your signal research access.
            </h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              CryptoDrone AI provides AI-powered crypto signal research,
              market dashboards, bullish-only signal previews, and paper-trading
              analytics. This app is paper-trading only and does not place real
              trades.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-white hover:bg-slate-900"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Free
            </p>
            <h2 className="mt-2 text-3xl font-black">Free Dashboard</h2>
            <p className="mt-3 text-slate-300">
              Basic market preview without giving away the V4 bot&apos;s best
              signal information.
            </p>

            <div className="mt-6">
              <span className="text-5xl font-black">$0</span>
              <span className="text-slate-400"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 rounded-2xl bg-slate-950/70 p-5 text-slate-300">
              <li>• Market mode</li>
              <li>• Volatility status</li>
              <li>• Paper-trading status</li>
              <li>• Masked public movers</li>
              <li>• Delayed signal preview</li>
              <li>• Stale-data warning</li>
            </ul>

            <Link
              href="/"
              className="mt-8 block w-full rounded-xl border border-slate-700 px-6 py-3 text-center font-bold text-white hover:bg-slate-900"
            >
              Use Free Dashboard
            </Link>
          </section>

          <section className="rounded-3xl border border-cyan-500/50 bg-cyan-500/10 p-7 shadow-2xl shadow-cyan-950/40">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
              Recommended
            </p>
            <h2 className="mt-2 text-3xl font-black">Pro</h2>
            <p className="mt-3 text-slate-300">
              Access bullish-only V4 signal research without seeing the bot&apos;s
              private formula.
            </p>

            <div className="mt-6">
              <span className="text-5xl font-black">$9.99</span>
              <span className="text-slate-400"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 rounded-2xl bg-slate-950/70 p-5 text-slate-300">
              <li>• Exact bullish-only signal names</li>
              <li>• Best bullish signal right now</li>
              <li>• Full bullish Top 10</li>
              <li>• Confidence score</li>
              <li>• ML score</li>
              <li>• Why this signal? reasoning cards</li>
              <li>• Open paper trades</li>
              <li>• Closed paper-trade stats</li>
              <li>• Watchlist alerts</li>
            </ul>

            <div className="mt-8">
              <CheckoutButton plan="pro">Subscribe to Pro</CheckoutButton>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Secure checkout powered by Stripe.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
            <p className="text-sm font-bold uppercase tracking-wide text-purple-300">
              Future Premium
            </p>
            <h2 className="mt-2 text-3xl font-black">Pro Plus</h2>
            <p className="mt-3 text-slate-300">
              Future premium tier for expanded signal history, deeper analytics,
              and stronger subscriber value.
            </p>

            <div className="mt-6">
              <span className="text-5xl font-black">$19.99</span>
              <span className="text-slate-400"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 rounded-2xl bg-slate-950/70 p-5 text-slate-300">
              <li>• Everything in Pro</li>
              <li>• More detailed signal history</li>
              <li>• Advanced performance breakdowns</li>
              <li>• Longer closed-trade history</li>
              <li>• Priority watchlist alerts</li>
              <li>• Possible founder-member pricing</li>
            </ul>

            <div className="mt-8">
              <CheckoutButton plan="pro_plus">Subscribe to Pro Plus</CheckoutButton>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Secure checkout powered by Stripe.
            </p>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-yellow-100">
          <p className="font-bold">Paper-only disclaimer</p>
          <p className="mt-2 text-sm leading-6">
            CryptoDrone AI is for educational, informational, and paper-trading
            research only. It does not place real trades, does not manage real
            money, and does not provide financial advice. Crypto trading is
            risky. No guaranteed profits.
          </p>
        </section>

        
      </div>
    </main>
  );
}
