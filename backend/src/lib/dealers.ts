import { pickBackend } from "@/lib/db/backend";
import {
  createCustomer,
  createRepair,
} from "@/lib/db";
import type { DemoDealer, DemoDealerBatch } from "@/lib/demo-store";
import { normalizeRepairIntakeChecks, type RepairIntakeChecks } from "@/lib/repair-intake";
import { connectDB } from "@/lib/mongodb";
import { Dealer, DealerBatch, Counter, Repair } from "@/lib/models";
import * as mem from "@/lib/memory-store";
import { compareAlphabetic } from "@/lib/search-utils";

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const NOT_DELETED = { isDeleted: { $ne: true } } as const;

function softDeleteFields(doc: {
  isDeleted?: boolean | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
  createdAt: Date;
}) {
  return {
    isDeleted: Boolean(doc.isDeleted),
    deletedAt: doc.deletedAt ?? null,
    updatedAt: doc.updatedAt ?? doc.createdAt,
  };
}

function toDealer(doc: {
  _id: string;
  name: string;
  shopName: string;
  phone: string;
  location?: string | null;
  notes?: string | null;
  customerId: string;
  createdAt: Date;
  isDeleted?: boolean | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
}): DemoDealer {
  return {
    id: doc._id,
    name: doc.name,
    shopName: doc.shopName,
    phone: doc.phone,
    location: doc.location ?? null,
    notes: doc.notes ?? null,
    customerId: doc.customerId,
    createdAt: doc.createdAt,
    ...softDeleteFields(doc),
  };
}

function toBatch(doc: {
  _id: string;
  dealerId: string;
  batchRef: string;
  notes?: string | null;
  deviceCount: number;
  createdAt: Date;
  isDeleted?: boolean | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
}): DemoDealerBatch {
  return {
    id: doc._id,
    dealerId: doc.dealerId,
    batchRef: doc.batchRef,
    notes: doc.notes ?? null,
    deviceCount: doc.deviceCount,
    createdAt: doc.createdAt,
    ...softDeleteFields(doc),
  };
}

async function nextBatchRef(): Promise<string> {
  if ((await pickBackend()) === "memory") return mem.nextDealerBatchRef();
  await connectDB();
  const counter = await Counter.findByIdAndUpdate(
    "dealerBatchSeq",
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  ).lean();
  return `DLR-${String(counter!.seq).padStart(6, "0")}`;
}

export type DealerInput = {
  name: string;
  shopName: string;
  phone: string;
  location?: string | null;
  notes?: string | null;
};

export type DealerBatchDeviceInput = {
  deviceBrandRaw?: string | null;
  deviceModelRaw: string;
  modelId?: string | null;
  issue: string;
  imei?: string | null;
  intakeChecks?: RepairIntakeChecks;
};

export type DealerBatchInput = {
  notes?: string | null;
  devices: DealerBatchDeviceInput[];
};

export async function queryDealers(opts: { q?: string; page: number; pageSize: number }) {
  if ((await pickBackend()) === "memory") return mem.queryDealers(opts);
  await connectDB();
  const qLower = opts.q?.trim().toLowerCase() ?? "";
  const filter: Record<string, unknown> = { ...NOT_DELETED };
  if (qLower) {
    const re = new RegExp(qLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: re }, { shopName: re }, { phone: re }, { location: re }];
  }
  const docs = await Dealer.find(filter).lean();
  const rows = docs.map(toDealer).sort((a, b) => compareAlphabetic(a.shopName, b.shopName));
  const total = rows.length;
  const dealers = rows.slice((opts.page - 1) * opts.pageSize, opts.page * opts.pageSize);
  return { dealers, total };
}

export async function getDealerById(id: string): Promise<DemoDealer | null> {
  if ((await pickBackend()) === "memory") return mem.getDealerById(id);
  await connectDB();
  const doc = await Dealer.findOne({ _id: id, ...NOT_DELETED }).lean();
  return doc ? toDealer(doc) : null;
}

export async function createDealer(data: DealerInput): Promise<DemoDealer> {
  if ((await pickBackend()) === "memory") return mem.createDealer(data);
  await connectDB();
  const phone = data.phone.replace(/\s+/g, "");
  const customer = await createCustomer({
    name: data.shopName.trim(),
    phone,
    altPhone: null,
    address: null,
    location: data.location?.trim() || null,
  });
  const id = newId("dealer");
  const now = new Date();
  const doc = await Dealer.create({
    _id: id,
    name: data.name.trim(),
    shopName: data.shopName.trim(),
    phone,
    location: data.location?.trim() || null,
    notes: data.notes?.trim() || null,
    customerId: customer.id,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    deletedAt: null,
  });
  return toDealer(doc.toObject());
}

export async function updateDealer(id: string, data: DealerInput): Promise<DemoDealer | null> {
  if ((await pickBackend()) === "memory") return mem.updateDealer(id, data);
  await connectDB();
  const doc = await Dealer.findOneAndUpdate(
    { _id: id, ...NOT_DELETED },
    {
      name: data.name.trim(),
      shopName: data.shopName.trim(),
      phone: data.phone.replace(/\s+/g, ""),
      location: data.location?.trim() || null,
      notes: data.notes?.trim() || null,
      updatedAt: new Date(),
    },
    { new: true }
  ).lean();
  return doc ? toDealer(doc) : null;
}

export async function listDealerBatches(dealerId: string): Promise<DemoDealerBatch[]> {
  if ((await pickBackend()) === "memory") return mem.listDealerBatches(dealerId);
  await connectDB();
  const docs = await DealerBatch.find({ dealerId, ...NOT_DELETED }).sort({ createdAt: -1 }).lean();
  return docs.map(toBatch);
}

export async function getDealerBatchById(id: string): Promise<DemoDealerBatch | null> {
  if ((await pickBackend()) === "memory") return mem.getDealerBatchById(id);
  await connectDB();
  const doc = await DealerBatch.findOne({ _id: id, ...NOT_DELETED }).lean();
  return doc ? toBatch(doc) : null;
}

export async function createDealerBatch(dealerId: string, data: DealerBatchInput) {
  const dealer = await getDealerById(dealerId);
  if (!dealer) return null;

  const batchNotes = data.notes?.trim() || null;

  if ((await pickBackend()) === "memory") {
    return mem.createDealerBatch(dealerId, { ...data, notes: batchNotes });
  }

  await connectDB();
  const batchId = newId("dbatch");
  const batchRef = await nextBatchRef();
  const now = new Date();

  const repairs = [];
  for (const device of data.devices) {
    const repair = await createRepair({
      customerId: dealer.customerId,
      source: "DEALER",
      dealerId: dealer.id,
      batchId,
      modelId: device.modelId || null,
      deviceBrandRaw: device.deviceBrandRaw?.trim() || null,
      deviceModelRaw: device.deviceModelRaw.trim(),
      imei: device.imei?.trim() || null,
      issue: device.issue.trim(),
      technicianId: null,
      amount: null,
      advancePaid: 0,
      notes: batchNotes,
      deliveryDate: null,
      intakeChecks: normalizeRepairIntakeChecks(device.intakeChecks),
    });
    repairs.push(repair);
  }

  const batch = await DealerBatch.create({
    _id: batchId,
    dealerId: dealer.id,
    batchRef,
    notes: batchNotes,
    deviceCount: repairs.length,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    deletedAt: null,
  });

  return { batch: toBatch(batch.toObject()), repairs };
}

export async function countDealerPendingJobs(dealerId: string): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.countDealerPendingJobs(dealerId);
  await connectDB();
  return Repair.countDocuments({
    dealerId,
    status: { $in: ["RECEIVED", "IN_REPAIR"] },
    ...NOT_DELETED,
  });
}
