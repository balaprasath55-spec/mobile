import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createRepair,
  getModelWithBrand,
  getStore,
  writeAudit,
  type DemoRepairStatus,
} from "@/lib/demo-store";
import { emptyToNull } from "@/lib/repairs";
import { repairSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim().toLowerCase() ?? "";
  const status = sp.get("status") as DemoRepairStatus | null;
  const customerId = sp.get("customerId");
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize") ?? 20)));

  const store = getStore();
  let rows = [...store.repairs];

  if (customerId) rows = rows.filter((r) => r.customerId === customerId);
  if (status) rows = rows.filter((r) => r.status === status);
  if (q) {
    rows = rows.filter((r) => {
      const customer = store.customers.find((c) => c.id === r.customerId);
      return (
        r.jobId.toLowerCase().includes(q) ||
        (r.imei ?? "").includes(q) ||
        r.issue.toLowerCase().includes(q) ||
        (r.deviceModelRaw ?? "").toLowerCase().includes(q) ||
        (r.deviceBrandRaw ?? "").toLowerCase().includes(q) ||
        (customer?.name.toLowerCase().includes(q) ?? false) ||
        (customer?.phone.includes(q) ?? false)
      );
    });
  }

  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const total = rows.length;
  const repairs = rows.slice((page - 1) * pageSize, page * pageSize).map((r) => {
    const customer = store.customers.find((c) => c.id === r.customerId)!;
    return {
      ...r,
      customer: { id: customer.id, name: customer.name, phone: customer.phone },
      model: getModelWithBrand(r.modelId),
      technician: null,
    };
  });

  return NextResponse.json({
    repairs,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = repairSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const store = getStore();
  const customer = store.customers.find((c) => c.id === parsed.data.customerId);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const repair = createRepair({
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

  writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Repair",
    entityId: repair.id,
    changes: { jobId: repair.jobId, customerId: repair.customerId, issue: repair.issue },
  });

  return NextResponse.json({ repair: { ...repair, customer } }, { status: 201 });
}
