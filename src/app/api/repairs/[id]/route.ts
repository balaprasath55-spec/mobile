import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  deleteRepair,
  getCustomerById,
  getModelWithBrand,
  getRepairById,
  updateRepair,
  writeAudit,
} from "@/lib/db";
import { emptyToNull } from "@/lib/repairs";
import { repairSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await requireAdmin();

  const repair = await getRepairById(params.id);
  if (!repair) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const customer = await getCustomerById(repair.customerId);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  return NextResponse.json({
    repair: {
      ...repair,
      customer,
      model: await getModelWithBrand(repair.modelId),
      technician: null,
      images: [],
      parts: [],
    },
  });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = repairSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const repair = await updateRepair(params.id, {
    customerId: parsed.data.customerId,
    modelId: emptyToNull(parsed.data.modelId),
    deviceBrandRaw: emptyToNull(parsed.data.deviceBrandRaw),
    deviceModelRaw: emptyToNull(parsed.data.deviceModelRaw),
    imei: emptyToNull(parsed.data.imei),
    issue: parsed.data.issue,
    technicianId: emptyToNull(parsed.data.technicianId),
    amount: parsed.data.amount ?? null,
    advancePaid: parsed.data.advancePaid ?? 0,
    notes: emptyToNull(parsed.data.notes),
    deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
  });

  if (!repair) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await writeAudit({
    adminUserId: auth.userId,
    action: "UPDATE",
    entityType: "Repair",
    entityId: params.id,
    changes: repair,
  });

  const customer = await getCustomerById(repair.customerId);
  return NextResponse.json({ repair: { ...repair, customer } });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin("ADMIN");

  const existing = await getRepairById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await deleteRepair(params.id);
  if (!ok) return NextResponse.json({ error: "Could not delete job." }, { status: 500 });

  await writeAudit({
    adminUserId: auth.userId,
    action: "DELETE",
    entityType: "Repair",
    entityId: params.id,
    changes: { jobId: existing.jobId, customerId: existing.customerId, issue: existing.issue },
  });

  return NextResponse.json({ ok: true });
}
