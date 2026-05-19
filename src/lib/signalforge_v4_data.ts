import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

type SignalDataId = "free_market_preview" | "pro_signals";

function readJsonFallback<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), "bot_output_v4", fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as T;
}

export async function readSignalforgeV4Data<T>(
  id: SignalDataId,
  fallbackFileName: string
): Promise<T> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase env missing for signal data. Using JSON fallback.");
    return readJsonFallback<T>(fallbackFileName);
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("signalforge_v4_data")
      .select("payload")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase signal data read failed:", error.message);
      return readJsonFallback<T>(fallbackFileName);
    }

    if (!data?.payload) {
      console.warn(`No Supabase payload for ${id}. Using JSON fallback.`);
      return readJsonFallback<T>(fallbackFileName);
    }

    return data.payload as T;
  } catch (error) {
    console.error("Signal data read crashed. Using JSON fallback.", error);
    return readJsonFallback<T>(fallbackFileName);
  }
}
