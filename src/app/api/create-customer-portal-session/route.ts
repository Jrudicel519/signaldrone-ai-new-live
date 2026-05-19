import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Customer portal is temporarily unavailable while billing is being relaunched.",
    },
    { status: 503 }
  );
}
