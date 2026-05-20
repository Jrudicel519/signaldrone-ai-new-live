import { NextResponse } from "next/server";
import { readSignalforgeV4Data } from "@/lib/signalforge_v4_data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await readSignalforgeV4Data<any>(
      "pro_signals",
      "pro_signals.json"
    );

    return NextResponse.json({
      status: "ok",
      source: "old-reader:signalforge_v4_data/pro_signals",
      updated_at: data?.updated_at || data?.generated_at || null,
      stale: Boolean(data?.stale),
      message: data?.message || null,
      data,
    });
  } catch (error) {
    console.error("Pro signals API error:", error);

    return NextResponse.json(
      {
        status: "error",
        error: "Could not read Pro signals from old SignalForge V4 reader.",
      },
      { status: 500 }
    );
  }
}
