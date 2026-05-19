import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    /*
      Temporary relaunch-safe version:
      This route builds successfully and returns a clear message until we reconnect
      Stripe customer IDs to signed-in Clerk/Supabase users.
    */
    return NextResponse.json(
      {
        error:
          "Customer portal is temporarily unavailable while billing is being relaunched.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Customer portal session error:", error);

    return NextResponse.json(
      { error: "Could not create customer portal session." },
      { status: 500 }
    );
  }
}
