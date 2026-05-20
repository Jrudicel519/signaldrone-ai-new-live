import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readSignalforgeV4Data } from "@/lib/signalforge_v4_data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    if (supabase) {
      const { data, error } = await supabase
        .from("signalforge_v4_data")
        .select("payload, updated_at")
        .eq("id", "pro_signals")
        .maybeSingle();

      if (!error && data?.payload) {
        const payload: any = data.payload;

        return NextResponse.json({
          status: "ok",
          source: "old-table:signalforge_v4_data/pro_signals",
          updated_at:
            data.updated_at ||
            payload.updated_at ||
            payload.generated_at ||
            null,
          stale: Boolean(payload.stale),
          message: payload.message || null,
          data: payload,
        });
      }

      console.warn("Old SignalForge table read failed:", error?.message);
    }

    const fallback = await readSignalforgeV4Data<any>(
      "pro_signals",
      "pro_signals.json"
    );

    return NextResponse.json({
      status: "ok",
      source: "old-reader-fallback:signalforge_v4_data/pro_signals",
      updated_at:
        fallback?.updated_at ||
        fallback?.generated_at ||
        null,
      stale: Boolean(fallback?.stale),
      message: fallback?.message || null,
      data: fallback,
    });
  } catch (error) {
    console.error("Pro signals API error:", error);

    return NextResponse.json(
      {
        status: "error",
        error: "Could not read Pro signals from old SignalForge V4 feed.",
      },
      { status: 500 }
    );
  }
}
