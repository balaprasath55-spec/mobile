import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  deleteCustomer,
  getModelWithBrand,
  getStore,
  updateCustomer,
  writeAudit,
} from "@/lib/demo-store";
import { emptyToNull } from "@/lib/repairs";
import { customerSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const store = getStore();
  const customer = store.customers.find((c) => c.id === params.id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const repairs = store.repairs
    .filter((r) => r.customerId === params.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((r) => ({
      ...r,
      model: getModelWithBrand(r.modelId),
      technician: null,
    }));

  return NextResponse.json({ customer: { ...customer, repairs } });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const customer = updateCustomer(params.id, {
    name: parsed.data.name,
    phone: parsed.data.phone.replace(/\s+/g, ""),
    altPhone: emptyToNull(parsed.data.altPhone),
    address: emptyToNull(parsed.data.address),
    location: emptyToNull(parsed.data.location),
  });

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  writeAudit({
    adminUserId: auth.userId,
    action: "UPDATE",
    entityType: "Customer",
    entityId: params.id,
    changes: customer,
  });

  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin("ADMIN");
  if ("error" in auth) return auth.error;

  const store = getStore();
  const existing = store.customers.find((c) => c.id === params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = deleteCustomer(params.id);
  if (!ok) {
    return NextResponse.json(
      { error: "Cannot delete customer with repair history." },
      { status: 400 }
    );
  }

  writeAudit({
    adminUserId: auth.userId,
    action: "DELETE",
    entityType: "Customer",
    entityId: params.id,
    changes: { name: existing.name, phone: existing.phone },
  });

  return NextResponse.json({ ok: true });
}
