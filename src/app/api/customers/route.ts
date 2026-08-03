import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createCustomer,
  getStore,
  writeAudit,
} from "@/lib/demo-store";
import { emptyToNull } from "@/lib/repairs";
import { customerSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  await requireAdmin();

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(sp.get("pageSize") ?? 20)));
  const location = sp.get("location")?.trim().toLowerCase() ?? "";

  const store = getStore();
  let rows = [...store.customers];

  if (q) {
    rows = rows.filter((c) => {
      const repairs = store.repairs.filter((r) => r.customerId === c.id);
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.altPhone ?? "").includes(q) ||
        (c.location ?? "").toLowerCase().includes(q) ||
        repairs.some(
          (r) =>
            r.jobId.toLowerCase().includes(q) ||
            (r.imei ?? "").includes(q) ||
            (r.deviceModelRaw ?? "").toLowerCase().includes(q)
        )
      );
    });
  }
  if (location) {
    rows = rows.filter((c) => (c.location ?? "").toLowerCase().includes(location));
  }

  const total = rows.length;
  const customers = rows.slice((page - 1) * pageSize, page * pageSize).map((c) => {
    const repairs = store.repairs
      .filter((r) => r.customerId === c.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return {
      ...c,
      _count: { repairs: repairs.length },
      repairs: repairs.slice(0, 1).map((r) => ({
        jobId: r.jobId,
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  });

  return NextResponse.json({
    customers,
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

  const customer = createCustomer({
    name: parsed.data.name,
    phone: parsed.data.phone.replace(/\s+/g, ""),
    altPhone: emptyToNull(parsed.data.altPhone),
    address: emptyToNull(parsed.data.address),
    location: emptyToNull(parsed.data.location),
  });

  writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Customer",
    entityId: customer.id,
    changes: customer,
  });

  return NextResponse.json({ customer }, { status: 201 });
}
