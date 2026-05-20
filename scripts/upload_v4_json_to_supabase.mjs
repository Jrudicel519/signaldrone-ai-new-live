import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Make sure they exist in Render environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function readJson(fileName) {
  const filePath = path.join(process.cwd(), "bot_output_v4", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

const now = new Date().toISOString();

const rows = [
  {
    id: "free_market_preview",
    payload: readJson("free_market_preview.json"),
    updated_at: now,
  },
  {
    id: "pro_signals",
    payload: readJson("pro_signals.json"),
    updated_at: now,
  },
];

const { error } = await supabase
  .from("signal_data")
  .upsert(rows, {
    onConflict: "id",
  });

if (error) {
  console.error("Upload failed:", error.message);
  process.exit(1);
}

console.log("✅ Uploaded latest V4 data to Supabase.");
console.log("Updated rows:", rows.map((row) => row.id).join(", "));
console.log("updated_at:", now);
