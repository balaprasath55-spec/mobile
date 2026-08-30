import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import {
  createCustomer,
  createRepair,
  findCustomerByPhone,
  writeAudit,
} from "@/lib/db";

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
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ||
      parsed.error.flatten().formErrors[0] ||
      "Invalid input";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const phone = parsed.data.phone.replace(/\s+/g, "");
  let customer = await findCustomerByPhone(phone);

  if (!customer) {
    customer = await createCustomer({
      name: parsed.data.name,
      phone,
      altPhone: null,
      address: null,
      location: parsed.data.location || null,
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Customer",
      entityId: customer.id,
      changes: { name: customer.name, phone },
    });
  }

  const repair = await createRepair({
    customerId: customer.id,
    modelId: parsed.data.modelId || null,
    deviceBrandRaw: parsed.data.deviceBrandRaw || null,
    deviceModelRaw: parsed.data.deviceModelRaw || null,
    imei: null,
    issue: parsed.data.issue,
    technicianId: null,
    amount: parsed.data.amount ?? null,
    advancePaid: 0,
    notes: parsed.data.notes || null,
    deliveryDate: null,
    imageUrl: parsed.data.imageUrl,
  });

  await writeAudit({
    adminUserId: auth.userId,
    action: "CREATE",
    entityType: "Repair",
    entityId: repair.id,
    changes: { jobId: repair.jobId, issue: repair.issue },
  });

  return NextResponse.json({ customer, repair }, { status: 201 });
}
