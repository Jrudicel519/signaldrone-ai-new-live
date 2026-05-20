import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

function readLocalFallback() {
  const filePath = path.join(process.cwd(), "bot_output_v4", "pro_signals.json");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    if (supabase) {
      const { data, error } = await supabase
        .from("signal_data")
        .select("payload, updated_at")
        .eq("id", "pro_signals")
        .maybeSingle();

      if (!error && data?.payload) {
        return NextResponse.json({
          status: "ok",
          source: "supabase:signal_data/pro_signals",
          updated_at: data.updated_at,
          data: data.payload,
        });
      }

      console.warn("Supabase pro_signals read failed or empty:", error?.message);
    }

    const fallback = readLocalFallback();

    if (fallback) {
      return NextResponse.json({
        status: "ok",
        source: "local fallback:bot_output_v4/pro_signals.json",
        data: fallback,
      });
    }

    return NextResponse.json(
      {
        status: "missing",
        error: "No Pro signal feed found in Supabase or local fallback.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Pro signals API error:", error);

    return NextResponse.json(
      { error: "Could not read pro signals feed." },
      { status: 500 }
    );
  }
}
