"use client";

import { useState } from "react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";

type CheckoutButtonProps = {
  plan: "pro" | "pro_plus";
  children: React.ReactNode;
};

export default function CheckoutButton({ plan, children }: CheckoutButtonProps) {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!authLoaded) {
    return (
      <button
        disabled
        className="w-full rounded-xl bg-zinc-700 px-4 py-3 font-semibold text-white"
      >
        Loading...
      </button>
    );
  }

  if (!isSignedIn || !userId) {
    return (
      <SignInButton mode="modal">
        <button className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black">
          Sign in to subscribe
        </button>
      </SignInButton>
    );
  }

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          clerkUserId: userId,
          email: user?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={startCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Opening checkout..." : children}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
