"use client";

import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";

export default function AccountBar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  async function handleSignOut() {
    await clerk.signOut();
    window.location.href = "/";
  }

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300">
        Loading account...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </Link>

        <Link
          href="/sign-up"
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
        >
          Create account
        </Link>
      </div>
    );
  }

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Signed in";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
        Signed in as <span className="font-bold">{email}</span>
      </div>

      <button
        onClick={() => clerk.openUserProfile()}
        className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white"
      >
        Manage account
      </button>

      <button
        onClick={handleSignOut}
        className="rounded-xl border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-200"
      >
        Sign out
      </button>
    </div>
  );
}
