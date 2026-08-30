import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createCustomer,
  createRepair,
  deleteEnquiry,
  findCustomerByPhone,
  getEnquiryById,
  updateEnquiryStatus,
  writeAudit,
} from "@/lib/db";
import type { DemoEnquiryStatus } from "@/lib/demo-store";
import { enquiryStatusSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await requireAdmin();

  const enquiry = await getEnquiryById(params.id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ enquiry });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = enquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const enquiry = await getEnquiryById(params.id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const from = enquiry.status;
  const updated = await updateEnquiryStatus(params.id, parsed.data.status as DemoEnquiryStatus);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await writeAudit({
    adminUserId: auth.userId,
    action: "STATUS_CHANGE",
    entityType: "Enquiry",
    entityId: params.id,
    changes: { from, to: updated.status },
  });

  return NextResponse.json({ enquiry: updated });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = (await req.json().catch(() => ({}))) as { createJob?: boolean };
  const enquiry = await getEnquiryById(params.id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const phone = enquiry.phone.replace(/\s+/g, "");
  let customer = await findCustomerByPhone(phone);

  if (!customer) {
    customer = await createCustomer({
      name: enquiry.name,
      phone,
      altPhone: null,
      address: null,
      location: enquiry.location,
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Customer",
      entityId: customer.id,
      changes: { fromEnquiry: enquiry.id },
    });
  }

  let repair = null;
  if (body.createJob !== false) {
    repair = await createRepair({
      customerId: customer.id,
      modelId: null,
      deviceBrandRaw: null,
      deviceModelRaw: enquiry.device,
      imei: null,
      issue: enquiry.issue || "Enquiry conversion",
      technicianId: null,
      amount: null,
      advancePaid: 0,
      notes: enquiry.message,
      deliveryDate: null,
      imageUrl: enquiry.imageUrl,
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Repair",
      entityId: repair.id,
      changes: { fromEnquiry: enquiry.id, jobId: repair.jobId },
    });
  }

  const updated = await updateEnquiryStatus(params.id, "CONVERTED");
  return NextResponse.json({ customer, repair, enquiry: updated });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin("ADMIN");

  const existing = await getEnquiryById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await deleteEnquiry(params.id);
  if (!ok) return NextResponse.json({ error: "Could not delete enquiry." }, { status: 500 });

  await writeAudit({
    adminUserId: auth.userId,
    action: "DELETE",
    entityType: "Enquiry",
    entityId: params.id,
    changes: { name: existing.name, phone: existing.phone },
  });

  return NextResponse.json({ ok: true });
}
