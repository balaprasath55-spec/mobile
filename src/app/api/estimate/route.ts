import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/demo-store";
import { estimateQuerySchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const parsed = estimateQuerySchema.safeParse({
    modelId: req.nextUrl.searchParams.get("modelId"),
    issueId: req.nextUrl.searchParams.get("issueId"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const estimate = getStore().estimates.find(
    (e) =>
      e.modelId === parsed.data.modelId &&
      e.issueId === parsed.data.issueId &&
      e.isActive
  );

  if (!estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  return NextResponse.json({
    priceMin: estimate.priceMin,
    priceMax: estimate.priceMax,
  });
}
