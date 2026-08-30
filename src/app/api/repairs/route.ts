import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createRepair,
  getCustomerById,
  getModelWithBrand,
  queryRepairs,
  writeAudit,
} from "@/lib/db";
import type { DemoRepairStatus } from "@/lib/demo-store";
import { emptyToNull } from "@/lib/repairs";
import { repairSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  await requireAdmin();

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const status = sp.get("status") as DemoRepairStatus | null;
  const customerId = sp.get("customerId") ?? undefined;
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize") ?? 20)));

  const { repairs, total, customerMap } = await queryRepairs({
    q,
    status: status ?? undefined,
    customerId,
    page,
    pageSize,
  });

  const enriched = await Promise.all(
    repairs.map(async (r) => {
      const customer = customerMap.get(r.customerId)!;
      return {
        ...r,
        customer: { id: customer.id, name: customer.name, phone: customer.phone },
        model: await getModelWithBrand(r.modelId),
        technician: null,
      };
    })
  );

  return NextResponse.json({
    repairs: enriched,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = repairSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await getCustomerById(parsed.data.customerId);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const repair = await createRepair({
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

  await writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Repair",
    entityId: repair.id,
    changes: { jobId: repair.jobId, customerId: repair.customerId, issue: repair.issue },
  });

  return NextResponse.json({ repair: { ...repair, customer } }, { status: 201 });
}
