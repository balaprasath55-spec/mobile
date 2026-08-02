import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const modelId = req.nextUrl.searchParams.get("modelId");
  const store = getStore();

  if (modelId) {
    const issueIds = new Set(
      store.estimates.filter((e) => e.modelId === modelId && e.isActive).map((e) => e.issueId)
    );
    const issues = store.issues
      .filter((i) => i.isActive && issueIds.has(i.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ id, name }) => ({ id, name }));
    return NextResponse.json({ issues });
  }

  const issues = store.issues
    .filter((i) => i.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ id, name }));
  return NextResponse.json({ issues });
}
