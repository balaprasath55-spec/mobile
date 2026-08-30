import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  getCustomerById,
  getRepairById,
  updateRepair,
  writeAudit,
} from "@/lib/db";
import type { DemoRepairStatus } from "@/lib/demo-store";
import { repairStatusSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = repairStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getRepairById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const status = parsed.data.status as DemoRepairStatus;
  const repair = await updateRepair(params.id, {
    status,
    deliveredAt: status === "DELIVERED" ? new Date() : existing.deliveredAt,
  });

  await writeAudit({
    adminUserId: auth.userId,
    action: "STATUS_CHANGE",
    entityType: "Repair",
    entityId: params.id,
    changes: { from: existing.status, to: status },
  });

  const customer = await getCustomerById(repair!.customerId);
  return NextResponse.json({ repair: { ...repair, customer } });
}
