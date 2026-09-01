/**
 * Browser-persisted demo store for Amplify.
 * Server memory resets between Lambda invocations, so new jobs live here.
 */

import type { DemoCustomer, DemoRepair, DemoRepairStatus } from "@/lib/demo-store";
import { normalizeRepairIntakeChecks, type RepairIntakeChecks } from "@/lib/repair-intake";

const KEY = "mr-mobile-zone-demo-v1";

type LocalDb = {
  customers: DemoCustomer[];
  repairs: DemoRepair[];
  jobSeq: number;
};

function emptyDb(): LocalDb {
  return { customers: [], repairs: [], jobSeq: 1 };
}

function reviveCustomer(c: DemoCustomer): DemoCustomer {
  const createdAt = new Date(c.createdAt);
  return {
    ...c,
    createdAt,
    updatedAt: c.updatedAt ? new Date(c.updatedAt) : createdAt,
    deletedAt: c.deletedAt ? new Date(c.deletedAt) : null,
    isDeleted: Boolean(c.isDeleted),
  };
}

function reviveRepair(r: DemoRepair): DemoRepair {
  const createdAt = new Date(r.createdAt);
  return {
    ...r,
    createdAt,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : createdAt,
    deletedAt: r.deletedAt ? new Date(r.deletedAt) : null,
    isDeleted: Boolean(r.isDeleted),
    deliveredAt: r.deliveredAt ? new Date(r.deliveredAt) : null,
    deliveryDate: r.deliveryDate ? new Date(r.deliveryDate) : null,
    intakeChecks: normalizeRepairIntakeChecks(r.intakeChecks),
    source: r.source ?? "WALK_IN",
    dealerId: r.dealerId ?? null,
    batchId: r.batchId ?? null,
  };
}

function revive(raw: LocalDb): LocalDb {
  return {
    jobSeq: raw.jobSeq || 1,
    customers: (raw.customers ?? []).map(reviveCustomer),
    repairs: (raw.repairs ?? []).map(reviveRepair),
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
  return loadLocalDb().repairs.filter((r) => !r.isDeleted);
}

export function listLocalCustomers() {
  return loadLocalDb().customers.filter((c) => !c.isDeleted);
}

export function getLocalRepairBundle(id: string): { repair: DemoRepair; customer: DemoCustomer } | null {
  const db = loadLocalDb();
  const repair = db.repairs.find((r) => r.id === id && !r.isDeleted);
  if (!repair) return null;
  const customer = db.customers.find((c) => c.id === repair.customerId && !c.isDeleted);
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
  intakeChecks?: RepairIntakeChecks;
}) {
  const db = loadLocalDb();
  const phone = input.phone.replace(/\s+/g, "");
  const now = new Date();

  let customer = db.customers.find((c) => c.phone === phone && !c.isDeleted);
  if (!customer) {
    customer = {
      id: uid("cust"),
      name: input.name.trim(),
      phone,
      altPhone: null,
      address: null,
      location: input.location?.trim() || null,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
      deletedAt: null,
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
    source: "WALK_IN",
    dealerId: null,
    batchId: null,
    intakeChecks: normalizeRepairIntakeChecks(input.intakeChecks),
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    deletedAt: null,
  };
  db.repairs.unshift(repair);
  saveLocalDb(db);
  return { customer, repair };
}

export function updateLocalRepairStatus(repairId: string, status: DemoRepairStatus) {
  const db = loadLocalDb();
  const idx = db.repairs.findIndex((r) => r.id === repairId && !r.isDeleted);
  if (idx < 0) return null;
  db.repairs[idx] = {
    ...db.repairs[idx],
    status,
    updatedAt: new Date(),
    deliveredAt: status === "DELIVERED" ? new Date() : db.repairs[idx].deliveredAt,
  };
  saveLocalDb(db);
  return db.repairs[idx];
}

export function updateLocalRepair(repairId: string, data: Partial<DemoRepair>) {
  const db = loadLocalDb();
  const idx = db.repairs.findIndex((r) => r.id === repairId && !r.isDeleted);
  if (idx < 0) return null;
  db.repairs[idx] = {
    ...db.repairs[idx],
    ...data,
    id: db.repairs[idx].id,
    jobId: db.repairs[idx].jobId,
    updatedAt: new Date(),
  };
  saveLocalDb(db);
  return db.repairs[idx];
}
