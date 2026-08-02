import { NextResponse } from "next/server";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const brands = getStore()
    .brands.filter((b) => b.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ id, name }));
  return NextResponse.json({ brands });
}
