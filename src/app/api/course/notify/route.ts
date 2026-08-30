import { NextRequest, NextResponse } from "next/server";
import { createCourseNotify } from "@/lib/db";
import { courseNotifySchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = courseNotifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const id = await createCourseNotify({
    name: parsed.data.name,
    contact: parsed.data.contact,
  });
  return NextResponse.json({ id, ok: true }, { status: 201 });
}
