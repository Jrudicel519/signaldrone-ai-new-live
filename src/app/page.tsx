"use client";

import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import HeaderAuthButton from "./HeaderAuthButton";

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <div className="mb-6">
            <img
              src="/signaldrone-hero.png"
              alt="Signal Drone AI hero banner"
              className="w-full rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
            />
          </div>

          <p className="mb-3 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Signal Drone AI V4
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Sign in to view the paper-trading research dashboard.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Signal Drone AI is an educational crypto signal dashboard for paper-trading research.
            It does not place real trades, manage user funds, connect to exchange accounts, or provide financial advice.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/free">
                  <button className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-slate-950 hover:bg-emerald-400">
                    Sign In
                  </button>
                </SignInButton>

                <Link
                  href="/pricing"
                  className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-6 py-3 text-center font-bold text-yellow-200 hover:bg-yellow-500/20"
                >
                  View Pricing
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/free"
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Open Free Dashboard
                </Link>

                <Link
                  href="/pro"
                  className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-center font-bold text-cyan-200 hover:bg-cyan-500/20"
                >
                  Open Pro Dashboard
                </Link>

                <HeaderAuthButton />
              </>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-6 text-yellow-100">
          <strong>Paper-only disclaimer:</strong> Signal Drone AI is for educational and informational paper-trading research only.
          No real trades are executed. No user funds are managed. No profit guarantees. Not financial advice.
        </section>
      </div>
    </main>
  );
}
