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
    throw new Error("Missing Supabase URL or service role key.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function readJson(fileName: string) {
  const filePath = path.join(process.cwd(), "bot_output_v4", fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const rows = [
      {
        id: "free_market_preview",
        payload: readJson("free_market_preview.json"),
        updated_at: new Date().toISOString(),
      },
      {
        id: "pro_signals",
        payload: readJson("pro_signals.json"),
        updated_at: new Date().toISOString(),
      },
    ];

    const { error } = await supabase
      .from("signal_data")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: "ok",
      message: "Seeded signal_data from bundled bot_output_v4 JSON files.",
      rows: rows.map((row) => row.id),
    });
  } catch (error) {
    console.error("Seed signal data error:", error);

    return NextResponse.json(
      { status: "error", message: "Could not seed signal_data." },
      { status: 500 }
    );
  }
}
