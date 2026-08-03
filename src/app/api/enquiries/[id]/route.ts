import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createCustomer,
  createRepair,
  getStore,
  writeAudit,
  type DemoEnquiryStatus,
} from "@/lib/demo-store";
import { enquiryStatusSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await requireAdmin();

  const enquiry = getStore().enquiries.find((e) => e.id === params.id);
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

  const store = getStore();
  const enquiry = store.enquiries.find((e) => e.id === params.id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const from = enquiry.status;
  enquiry.status = parsed.data.status as DemoEnquiryStatus;

  writeAudit({
    adminUserId: auth.userId,
    action: "STATUS_CHANGE",
    entityType: "Enquiry",
    entityId: params.id,
    changes: { from, to: enquiry.status },
  });

  return NextResponse.json({ enquiry });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = (await req.json().catch(() => ({}))) as { createJob?: boolean };
  const store = getStore();
  const enquiry = store.enquiries.find((e) => e.id === params.id);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let customer = store.customers.find((c) => c.phone === enquiry.phone.replace(/\s+/g, ""));
  if (!customer) {
    customer = createCustomer({
      name: enquiry.name,
      phone: enquiry.phone.replace(/\s+/g, ""),
      altPhone: null,
      address: null,
      location: enquiry.location,
    });
    writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Customer",
      entityId: customer.id,
      changes: { fromEnquiry: enquiry.id },
    });
  }

  let repair = null;
  if (body.createJob !== false) {
    repair = createRepair({
      customerId: customer.id,
      modelId: null,
      deviceBrandRaw: null,
      deviceModelRaw: enquiry.device,
      imei: null,
      issue: enquiry.issue || "Enquiry conversion",
      technicianId: null,
      amount: null,
      advancePaid: 0,
      warrantyDays: null,
      notes: enquiry.message,
      deliveryDate: null,
      imageUrl: enquiry.imageUrl,
    });
    writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Repair",
      entityId: repair.id,
      changes: { fromEnquiry: enquiry.id, jobId: repair.jobId },
    });
  }

  enquiry.status = "CONVERTED";
  return NextResponse.json({ customer, repair });
}
