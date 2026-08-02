import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const brandId = req.nextUrl.searchParams.get("brandId");
  if (!brandId) {
    return NextResponse.json({ models: [], error: "brandId required" }, { status: 400 });
  }
  const models = getStore()
    .models.filter((m) => m.brandId === brandId && m.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name, brandId: b }) => ({ id, name, brandId: b }));
  return NextResponse.json({ models });
}
