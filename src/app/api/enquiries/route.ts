import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createEnquiry, getStore } from "@/lib/demo-store";
import { enquirySchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const enquiry = createEnquiry({
      name: parsed.data.name,
      phone: parsed.data.phone,
      device: parsed.data.device || null,
      issue: parsed.data.issue,
      location: parsed.data.location || null,
      message: parsed.data.message || null,
      imageUrl: parsed.data.imageUrl,
    });

    return NextResponse.json({ id: enquiry.id, ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save enquiry" }, { status: 500 });
  }
}

export async function GET() {
  await requireAdmin();

  const enquiries = getStore().enquiries;
  return NextResponse.json({ enquiries });
}
