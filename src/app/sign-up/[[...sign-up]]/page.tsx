import Link from "next/link";

export default function SignUpCatchAllPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-black">Create your Signal Drone AI account</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          Account creation is being reconnected. Checkout is available now through Stripe.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/pricing" className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950">
            Subscribe with Stripe
          </Link>
          <Link href="/" className="rounded-2xl border border-white/15 px-6 py-3 font-black text-white">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
