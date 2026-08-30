import { NextRequest, NextResponse } from "next/server";
import { getEstimate } from "@/lib/db";
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

  const estimate = await getEstimate(parsed.data.modelId, parsed.data.issueId);
  if (!estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  return NextResponse.json({
    priceMin: estimate.priceMin,
    priceMax: estimate.priceMax,
  });
}
