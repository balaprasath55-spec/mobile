import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getStore, updateRepair, writeAudit, type DemoRepairStatus } from "@/lib/demo-store";
import { repairStatusSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = repairStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const store = getStore();
  const existing = store.repairs.find((r) => r.id === params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const status = parsed.data.status as DemoRepairStatus;
  const repair = updateRepair(params.id, {
    status,
    deliveredAt: status === "DELIVERED" ? new Date() : existing.deliveredAt,
  });

  writeAudit({
    adminUserId: auth.userId,
    action: "STATUS_CHANGE",
    entityType: "Repair",
    entityId: params.id,
    changes: { from: existing.status, to: status },
  });

  const customer = store.customers.find((c) => c.id === repair!.customerId)!;
  return NextResponse.json({ repair: { ...repair, customer } });
}
