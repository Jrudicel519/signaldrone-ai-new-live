import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    active: false,
    status: "relaunching",
    message: "Subscription syncing is being reconnected.",
  });
}
