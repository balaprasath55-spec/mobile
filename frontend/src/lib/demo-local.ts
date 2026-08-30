/**
 * Browser-persisted demo store for Amplify.
 * Server memory resets between Lambda invocations, so new jobs live here.
 */

import type { DemoCustomer, DemoRepair, DemoRepairStatus } from "@/lib/demo-store";

const KEY = "mr-mobile-zone-demo-v1";

type LocalDb = {
  customers: DemoCustomer[];
  repairs: DemoRepair[];
  jobSeq: number;
};

function emptyDb(): LocalDb {
  return { customers: [], repairs: [], jobSeq: 1 };
}

function revive(raw: LocalDb): LocalDb {
  return {
    jobSeq: raw.jobSeq || 1,
    customers: (raw.customers ?? []).map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    })),
    repairs: (raw.repairs ?? []).map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      deliveredAt: r.deliveredAt ? new Date(r.deliveredAt) : null,
      deliveryDate: r.deliveryDate ? new Date(r.deliveryDate) : null,
    })),
  };
}

export function loadLocalDb(): LocalDb {
  if (typeof window === "undefined") return emptyDb();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDb();
    return revive(JSON.parse(raw) as LocalDb);
  } catch {
    return emptyDb();
  }
}

function saveLocalDb(db: LocalDb) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function listLocalRepairs() {
  return loadLocalDb().repairs;
}

export function listLocalCustomers() {
  return loadLocalDb().customers;
}

export function getLocalRepairBundle(id: string): { repair: DemoRepair; customer: DemoCustomer } | null {
  const db = loadLocalDb();
  const repair = db.repairs.find((r) => r.id === id);
  if (!repair) return null;
  const customer = db.customers.find((c) => c.id === repair.customerId);
  if (!customer) return null;
  return { repair, customer };
}

export function createLocalQuickJob(input: {
  name: string;
  phone: string;
  issue: string;
  imageUrl: string;
  modelId?: string | null;
  deviceBrandRaw?: string;
  deviceModelRaw?: string;
  location?: string;
  amount?: number | null;
  notes?: string;
}) {
  const db = loadLocalDb();
  const phone = input.phone.replace(/\s+/g, "");

  let customer = db.customers.find((c) => c.phone === phone);
  if (!customer) {
    customer = {
      id: uid("cust"),
      name: input.name.trim(),
      phone,
      altPhone: null,
      address: null,
      location: input.location?.trim() || null,
      createdAt: new Date(),
    };
    db.customers.unshift(customer);
  }

  const jobId = `MRZ-${String(db.jobSeq).padStart(6, "0")}`;
  db.jobSeq += 1;

  const repair: DemoRepair = {
    id: uid("rep"),
    jobId,
    customerId: customer.id,
    modelId: input.modelId || null,
    deviceBrandRaw: input.deviceBrandRaw || null,
    deviceModelRaw: input.deviceModelRaw || null,
    imei: null,
    issue: input.issue.trim(),
    status: "RECEIVED",
    technicianId: null,
    amount: input.amount ?? null,
    advancePaid: 0,
    notes: input.notes?.trim() || null,
    deliveryDate: null,
    deliveredAt: null,
    imageUrl: input.imageUrl,
    createdAt: new Date(),
  };
  db.repairs.unshift(repair);
  saveLocalDb(db);
  return { customer, repair };
}

export function updateLocalRepairStatus(repairId: string, status: DemoRepairStatus) {
  const db = loadLocalDb();
  const idx = db.repairs.findIndex((r) => r.id === repairId);
  if (idx < 0) return null;
  db.repairs[idx] = {
    ...db.repairs[idx],
    status,
    deliveredAt: status === "DELIVERED" || status === "CLOSED" ? new Date() : db.repairs[idx].deliveredAt,
  };
  saveLocalDb(db);
  return db.repairs[idx];
}

export function updateLocalRepair(repairId: string, data: Partial<DemoRepair>) {
  const db = loadLocalDb();
  const idx = db.repairs.findIndex((r) => r.id === repairId);
  if (idx < 0) return null;
  db.repairs[idx] = {
    ...db.repairs[idx],
    ...data,
    id: db.repairs[idx].id,
    jobId: db.repairs[idx].jobId,
  };
  saveLocalDb(db);
  return db.repairs[idx];
}
