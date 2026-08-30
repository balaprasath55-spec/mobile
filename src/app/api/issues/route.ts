import { NextRequest, NextResponse } from "next/server";
import { listIssues } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const modelId = req.nextUrl.searchParams.get("modelId") ?? undefined;
  const issues = await listIssues(modelId);
  return NextResponse.json({ issues: issues.map(({ id, name }) => ({ id, name })) });
}
