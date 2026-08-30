import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  deleteCustomer,
  getCustomerById,
  getModelWithBrand,
  getRepairsForCustomer,
  updateCustomer,
  writeAudit,
} from "@/lib/db";
import { emptyToNull } from "@/lib/repairs";
import { customerSchema } from "@/lib/validators";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await requireAdmin();

  const customer = await getCustomerById(params.id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const repairs = await getRepairsForCustomer(params.id);
  const withModels = await Promise.all(
    repairs.map(async (r) => ({
      ...r,
      model: await getModelWithBrand(r.modelId),
      technician: null,
    }))
  );

  return NextResponse.json({ customer: { ...customer, repairs: withModels } });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await updateCustomer(params.id, {
    name: parsed.data.name,
    phone: parsed.data.phone.replace(/\s+/g, ""),
    altPhone: emptyToNull(parsed.data.altPhone),
    address: emptyToNull(parsed.data.address),
    location: emptyToNull(parsed.data.location),
  });

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await writeAudit({
    adminUserId: auth.userId,
    action: "UPDATE",
    entityType: "Customer",
    entityId: params.id,
    changes: customer,
  });

  return NextResponse.json({ customer });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin("ADMIN");

  const cascade = req.nextUrl.searchParams.get("cascade") === "true";
  const existing = await getCustomerById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await deleteCustomer(params.id, cascade);
  if (!ok) {
    return NextResponse.json(
      {
        error: cascade
          ? "Could not delete customer."
          : "This customer has repair jobs. Confirm again to delete the customer and all their jobs.",
      },
      { status: 400 }
    );
  }

  await writeAudit({
    adminUserId: auth.userId,
    action: "DELETE",
    entityType: "Customer",
    entityId: params.id,
    changes: { name: existing.name, phone: existing.phone, cascade },
  });

  return NextResponse.json({ ok: true });
}
