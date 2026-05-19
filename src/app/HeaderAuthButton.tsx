'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export default function HeaderAuthButton() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <span className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400">
        Loading...
      </span>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/account"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Account
        </Link>
        <UserButton />
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
    >
      Sign In
    </Link>
  );
}
