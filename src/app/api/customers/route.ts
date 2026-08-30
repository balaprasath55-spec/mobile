import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createCustomer, queryCustomers, getRepairsForCustomer, writeAudit } from "@/lib/db";
import { emptyToNull } from "@/lib/repairs";
import { customerSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  await requireAdmin();

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize") ?? 20)));
  const location = sp.get("location")?.trim() ?? "";

  const { customers, total } = await queryCustomers({ q, location, page, pageSize });

  const enriched = await Promise.all(
    customers.map(async (c) => {
      const repairs = await getRepairsForCustomer(c.id);
      return {
        ...c,
        _count: { repairs: repairs.length },
        repairs: repairs.slice(0, 1).map((r) => ({
          jobId: r.jobId,
          status: r.status,
          createdAt: r.createdAt,
        })),
      };
    })
  );

  return NextResponse.json({
    customers: enriched,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await createCustomer({
    name: parsed.data.name,
    phone: parsed.data.phone.replace(/\s+/g, ""),
    altPhone: emptyToNull(parsed.data.altPhone),
    address: emptyToNull(parsed.data.address),
    location: emptyToNull(parsed.data.location),
  });

  await writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Customer",
    entityId: customer.id,
    changes: customer,
  });

  return NextResponse.json({ customer }, { status: 201 });
}
