import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/demo-store";
import { courseNotifySchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = courseNotifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const row = {
    id: `course_${Math.random().toString(36).slice(2, 10)}`,
    name: parsed.data.name,
    contact: parsed.data.contact,
    createdAt: new Date(),
  };
  getStore().courseNotifies.unshift(row);
  return NextResponse.json({ id: row.id, ok: true }, { status: 201 });
}
