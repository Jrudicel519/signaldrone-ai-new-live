"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ManageSubscriptionButton() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");

    try {
      if (!isSignedIn || !userId) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch("/api/create-customer-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal.");
      setLoading(false);
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div>
      <button
        onClick={openPortal}
        disabled={loading}
        className="rounded-xl bg-white px-4 py-2 font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Opening billing..." : "Manage Subscription"}
      </button>

      {error ? (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
