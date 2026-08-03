import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import {
  createCustomer,
  createRepair,
  getStore,
  writeAudit,
} from "@/lib/demo-store";

const quickJobSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone is required")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone"),
  issue: z.string().min(2, "Issue is required"),
  imageUrl: z.string().min(1, "Photo is required"),
  modelId: z.string().optional().nullable().or(z.literal("")),
  deviceBrandRaw: z.string().optional().or(z.literal("")),
  deviceModelRaw: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().nonnegative().optional().nullable(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();

  const body = await req.json();
  const parsed = quickJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const phone = parsed.data.phone.replace(/\s+/g, "");
  const store = getStore();
  let customer = store.customers.find((c) => c.phone === phone);

  if (!customer) {
    customer = createCustomer({
      name: parsed.data.name,
      phone,
      altPhone: null,
      address: null,
      location: parsed.data.location || null,
    });
    writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Customer",
      entityId: customer.id,
      changes: { name: customer.name, phone },
    });
  }

  const repair = createRepair({
    customerId: customer.id,
    modelId: parsed.data.modelId || null,
    deviceBrandRaw: parsed.data.deviceBrandRaw || null,
    deviceModelRaw: parsed.data.deviceModelRaw || null,
    imei: null,
    issue: parsed.data.issue,
    technicianId: null,
    amount: parsed.data.amount ?? null,
    advancePaid: 0,
    warrantyDays: null,
    notes: parsed.data.notes || null,
    deliveryDate: null,
    imageUrl: parsed.data.imageUrl,
  });

  writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Repair",
    entityId: repair.id,
    changes: { jobId: repair.jobId, issue: repair.issue },
  });

  return NextResponse.json({ customer, repair }, { status: 201 });
}
