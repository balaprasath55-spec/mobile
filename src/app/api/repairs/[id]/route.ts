import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getModelWithBrand, getStore, updateRepair, writeAudit } from "@/lib/demo-store";
import { emptyToNull } from "@/lib/repairs";
import { repairSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await requireAdmin();

  const store = getStore();
  const repair = store.repairs.find((r) => r.id === params.id);
  if (!repair) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const customer = store.customers.find((c) => c.id === repair.customerId)!;
  return NextResponse.json({
    repair: {
      ...repair,
      customer,
      model: getModelWithBrand(repair.modelId),
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

  const repair = updateRepair(params.id, {
    customerId: parsed.data.customerId,
    modelId: emptyToNull(parsed.data.modelId),
    deviceBrandRaw: emptyToNull(parsed.data.deviceBrandRaw),
    deviceModelRaw: emptyToNull(parsed.data.deviceModelRaw),
    imei: emptyToNull(parsed.data.imei),
    issue: parsed.data.issue,
    technicianId: emptyToNull(parsed.data.technicianId),
    amount: parsed.data.amount ?? null,
    advancePaid: parsed.data.advancePaid ?? 0,
    warrantyDays: parsed.data.warrantyDays ?? null,
    notes: emptyToNull(parsed.data.notes),
    deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
  });

  if (!repair) return NextResponse.json({ error: "Not found" }, { status: 404 });

  writeAudit({
    adminUserId: auth.userId,
    action: "UPDATE",
    entityType: "Repair",
    entityId: params.id,
    changes: repair,
  });

  const customer = getStore().customers.find((c) => c.id === repair.customerId)!;
  return NextResponse.json({ repair: { ...repair, customer } });
}
