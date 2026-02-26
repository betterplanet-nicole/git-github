import { NextRequest, NextResponse } from "next/server";
import { generateSnapshot } from "@/lib/mockData";
import { persistRecord } from "@/lib/persistence";

export async function GET(request: NextRequest) {
  const seed = request.nextUrl.searchParams.get("seed") ?? process.env.MOCK_SEED ?? "utility-seed";
  const snapshot = generateSnapshot(seed);
  persistRecord({ kind: "event", body: snapshot as unknown as Record<string, unknown> });
  return NextResponse.json(snapshot);
}
