import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "bot_output_v4", "pro_signals.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error: "pro_signals.json not found",
          path: "bot_output_v4/pro_signals.json",
        },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    return NextResponse.json({
      status: "ok",
      source: "bot_output_v4/pro_signals.json",
      data,
    });
  } catch (error) {
    console.error("Pro signals API error:", error);

    return NextResponse.json(
      { error: "Could not read pro signals feed." },
      { status: 500 }
    );
  }
}
