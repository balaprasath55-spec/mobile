import { buildCatalogSeed } from "@/lib/db/catalog-seed";
import type {
  DemoCustomer,
  DemoEnquiry,
  DemoEnquiryStatus,
  DemoEstimate,
  DemoIssue,
  DemoBrand,
  DemoModel,
  DemoRepair,
  DemoRepairStatus,
} from "@/lib/demo-store";
import { buildShopRecords } from "@/lib/shop-data";
import { compareAlphabetic, bestSequentialRank } from "@/lib/search-utils";
import { connectDB } from "@/lib/mongodb";
import { pickBackend } from "@/lib/db/backend";
import * as mem from "@/lib/memory-store";
import {
  AuditLog,
  Brand,
  Counter,
  CourseNotify,
  Customer,
  DeviceModel,
  Enquiry,
  Estimate,
  Issue,
  Repair,
  type CustomerDoc,
  type RepairDoc,
} from "@/lib/models";

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function toCustomer(doc: CustomerDoc): DemoCustomer {
  return {
    id: doc._id,
    name: doc.name,
    phone: doc.phone,
    altPhone: doc.altPhone ?? null,
    address: doc.address ?? null,
    location: doc.location ?? null,
    createdAt: doc.createdAt,
  };
}

function toRepair(doc: RepairDoc): DemoRepair {
  return {
    id: doc._id,
    jobId: doc.jobId,
    customerId: doc.customerId,
    modelId: doc.modelId ?? null,
    deviceBrandRaw: doc.deviceBrandRaw ?? null,
    deviceModelRaw: doc.deviceModelRaw ?? null,
    imei: doc.imei ?? null,
    issue: doc.issue,
    status: doc.status as DemoRepairStatus,
    technicianId: doc.technicianId ?? null,
    amount: doc.amount ?? null,
    advancePaid: doc.advancePaid ?? 0,
    deliveryDate: doc.deliveryDate ?? null,
    deliveredAt: doc.deliveredAt ?? null,
    notes: doc.notes ?? null,
    imageUrl: doc.imageUrl ?? null,
    createdAt: doc.createdAt,
  };
}

function toEnquiry(doc: {
  _id: string;
  name: string;
  phone: string;
  device?: string | null;
  issue?: string | null;
  location?: string | null;
  message?: string | null;
  imageUrl?: string | null;
  status: string;
  createdAt: Date;
}): DemoEnquiry {
  return {
    id: doc._id,
    name: doc.name,
    phone: doc.phone,
    device: doc.device ?? null,
    issue: doc.issue ?? null,
    location: doc.location ?? null,
    message: doc.message ?? null,
    imageUrl: doc.imageUrl ?? null,
    status: doc.status as DemoEnquiryStatus,
    createdAt: doc.createdAt,
  };
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Seed ───────────────────────────────────────────────────────────────────

/** Import shop JSON into MongoDB — always targets Atlas, never in-memory fallback. */
export async function seedMongoDirect(force = false) {
  const { resetBackendChoice } = await import("@/lib/db/backend");
  const { resetMongoConnection, connectDB } = await import("@/lib/mongodb");
  resetBackendChoice();
  resetMongoConnection();
  await connectDB({ fresh: true });

  const existing = await Customer.estimatedDocumentCount();
  if (existing > 0 && !force) {
    return { skipped: true, customers: existing, repairs: await Repair.estimatedDocumentCount() };
  }

  if (force) {
    await Promise.all([
      Customer.deleteMany({}),
      Repair.deleteMany({}),
      Enquiry.deleteMany({}),
      Brand.deleteMany({}),
      DeviceModel.deleteMany({}),
      Issue.deleteMany({}),
      Estimate.deleteMany({}),
      AuditLog.deleteMany({}),
      CourseNotify.deleteMany({}),
      Counter.deleteMany({}),
    ]);
  }

  const { brands, models, issues, estimates } = buildCatalogSeed();
  await Brand.insertMany(brands.map((b) => ({ _id: b.id, name: b.name, isActive: b.isActive })));
  await DeviceModel.insertMany(
    models.map((m) => ({ _id: m.id, brandId: m.brandId, name: m.name, isActive: m.isActive }))
  );
  await Issue.insertMany(issues.map((i) => ({ _id: i.id, name: i.name, isActive: i.isActive })));
  await Estimate.insertMany(
    estimates.map((e) => ({
      _id: e.id,
      modelId: e.modelId,
      issueId: e.issueId,
      priceMin: e.priceMin,
      priceMax: e.priceMax,
      isActive: e.isActive,
    }))
  );

  const { customers, repairs, jobSeq } = buildShopRecords();
  await Customer.insertMany(
    customers.map((c) => ({
      _id: c.id,
      name: c.name,
      phone: c.phone,
      altPhone: c.altPhone,
      address: c.address,
      location: c.location,
      createdAt: c.createdAt,
    }))
  );
  await Repair.insertMany(
    repairs.map((r) => ({
      _id: r.id,
      jobId: r.jobId,
      customerId: r.customerId,
      modelId: r.modelId,
      deviceBrandRaw: r.deviceBrandRaw,
      deviceModelRaw: r.deviceModelRaw,
      imei: r.imei,
      issue: r.issue,
      status: r.status,
      technicianId: r.technicianId,
      amount: r.amount,
      advancePaid: r.advancePaid,
      deliveryDate: r.deliveryDate,
      deliveredAt: r.deliveredAt,
      notes: r.notes,
      imageUrl: r.imageUrl,
      createdAt: r.createdAt,
    }))
  );
  await Counter.create({ _id: "jobSeq", seq: jobSeq });

  return { skipped: false, customers: customers.length, repairs: repairs.length, jobSeq };
}

export async function seedDatabase(force = false) {
  if ((await pickBackend()) === "memory") {
    mem.ensureSeeded();
    return { skipped: true, customers: await mem.countCustomers(), repairs: await mem.getRepairCount() };
  }
  return seedMongoDirect(force);
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export async function listBrands(): Promise<DemoBrand[]> {
  if ((await pickBackend()) === "memory") return mem.listBrands();
  await connectDB();
  const docs = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
  return docs.map((b) => ({ id: b._id, name: b.name, isActive: b.isActive }));
}

export async function listModels(brandId?: string): Promise<DemoModel[]> {
  if ((await pickBackend()) === "memory") return mem.listModels(brandId);
  await connectDB();
  const filter = brandId ? { brandId, isActive: true } : { isActive: true };
  const docs = await DeviceModel.find(filter).sort({ name: 1 }).lean();
  return docs.map((m) => ({ id: m._id, brandId: m.brandId, name: m.name, isActive: m.isActive }));
}

export async function listIssues(modelId?: string): Promise<DemoIssue[]> {
  if ((await pickBackend()) === "memory") return mem.listIssues(modelId);
  await connectDB();
  if (modelId) {
    const issueIds = await Estimate.distinct("issueId", { modelId, isActive: true });
    const docs = await Issue.find({ _id: { $in: issueIds }, isActive: true }).sort({ name: 1 }).lean();
    return docs.map((i) => ({ id: i._id, name: i.name, isActive: i.isActive }));
  }
  const docs = await Issue.find({ isActive: true }).sort({ name: 1 }).lean();
  return docs.map((i) => ({ id: i._id, name: i.name, isActive: i.isActive }));
}

export async function getEstimate(modelId: string, issueId: string): Promise<DemoEstimate | null> {
  if ((await pickBackend()) === "memory") return mem.getEstimate(modelId, issueId);
  await connectDB();
  const doc = await Estimate.findOne({ modelId, issueId, isActive: true }).lean();
  if (!doc) return null;
  return {
    id: doc._id,
    modelId: doc.modelId,
    issueId: doc.issueId,
    priceMin: doc.priceMin,
    priceMax: doc.priceMax,
    isActive: doc.isActive,
  };
}

export async function getBrandName(brandId: string) {
  if ((await pickBackend()) === "memory") return mem.getBrandName(brandId);
  await connectDB();
  const doc = await Brand.findById(brandId).lean();
  return doc?.name;
}

export async function getModelWithBrand(modelId: string | null) {
  if ((await pickBackend()) === "memory") return mem.getModelWithBrand(modelId);
  if (!modelId) return null;
  await connectDB();
  const model = await DeviceModel.findById(modelId).lean();
  if (!model) return null;
  const brand = await Brand.findById(model.brandId).lean();
  if (!brand) return null;
  return {
    id: model._id,
    brandId: model.brandId,
    name: model.name,
    isActive: model.isActive,
    brand: { id: brand._id, name: brand.name, isActive: brand.isActive },
  };
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function getCustomerById(id: string): Promise<DemoCustomer | null> {
  if ((await pickBackend()) === "memory") return mem.getCustomerById(id);
  await connectDB();
  const doc = await Customer.findById(id).lean();
  return doc ? toCustomer(doc) : null;
}

export async function findCustomerByPhone(phone: string): Promise<DemoCustomer | null> {
  if ((await pickBackend()) === "memory") return mem.findCustomerByPhone(phone);
  await connectDB();
  const doc = await Customer.findOne({ phone }).lean();
  return doc ? toCustomer(doc) : null;
}

export async function countCustomers(): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.countCustomers();
  await connectDB();
  return Customer.countDocuments();
}

export async function queryCustomers(opts: {
  q?: string;
  location?: string;
  page: number;
  pageSize: number;
}) {
  if ((await pickBackend()) === "memory") return mem.queryCustomers(opts);
  await connectDB();
  const { q, location, page, pageSize } = opts;
  const qLower = q?.trim().toLowerCase() ?? "";
  const locLower = location?.trim().toLowerCase() ?? "";

  let customerIdsFromRepairs: string[] = [];
  if (qLower) {
    const re = new RegExp(escapeRegex(qLower), "i");
    customerIdsFromRepairs = await Repair.distinct("customerId", {
      $or: [{ jobId: re }, { imei: re }, { issue: re }, { deviceBrandRaw: re }, { deviceModelRaw: re }],
    });
  }

  const filter: Record<string, unknown> = {};
  if (locLower) filter.location = { $regex: escapeRegex(locLower), $options: "i" };
  if (qLower) {
    const re = new RegExp(escapeRegex(qLower), "i");
    filter.$or = [
      { name: re },
      { phone: re },
      { altPhone: re },
      { location: re },
      { _id: { $in: customerIdsFromRepairs } },
    ];
  }

  const docs = await Customer.find(filter).lean();
  const rows = docs.map(toCustomer);

  if (qLower) {
    rows.sort((a, b) => {
      const rankA = bestSequentialRank([a.name, a.phone, a.location], qLower);
      const rankB = bestSequentialRank([b.name, b.phone, b.location], qLower);
      if (rankA !== rankB) return rankA - rankB;
      return compareAlphabetic(a.name, b.name);
    });
  } else {
    rows.sort((a, b) => compareAlphabetic(a.name, b.name));
  }

  const total = rows.length;
  const customers = rows.slice((page - 1) * pageSize, page * pageSize);
  return { customers, total };
}

export async function getRepairsForCustomer(customerId: string): Promise<DemoRepair[]> {
  if ((await pickBackend()) === "memory") return mem.getRepairsForCustomer(customerId);
  await connectDB();
  const docs = await Repair.find({ customerId }).sort({ createdAt: -1 }).lean();
  return docs.map(toRepair);
}

export async function createCustomer(
  data: Omit<DemoCustomer, "id" | "createdAt">
): Promise<DemoCustomer> {
  if ((await pickBackend()) === "memory") return mem.createCustomer(data);
  await connectDB();
  const id = newId("cust");
  const doc = await Customer.create({
    _id: id,
    ...data,
    createdAt: new Date(),
  });
  return toCustomer(doc.toObject());
}

export async function updateCustomer(
  customerId: string,
  data: Partial<DemoCustomer>
): Promise<DemoCustomer | null> {
  if ((await pickBackend()) === "memory") return mem.updateCustomer(customerId, data);
  await connectDB();
  const { id: _omitId, createdAt: _omitCreated, ...rest } = data;
  void _omitId;
  void _omitCreated;
  const doc = await Customer.findByIdAndUpdate(customerId, rest, { new: true }).lean();
  return doc ? toCustomer(doc) : null;
}

export async function deleteCustomer(customerId: string, cascade = false): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteCustomer(customerId, cascade);
  await connectDB();
  if (cascade) {
    await Repair.deleteMany({ customerId });
  } else {
    const hasRepairs = await Repair.exists({ customerId });
    if (hasRepairs) return false;
  }
  const result = await Customer.deleteOne({ _id: customerId });
  return result.deletedCount === 1;
}

export async function deleteRepair(repairId: string): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteRepair(repairId);
  await connectDB();
  const result = await Repair.deleteOne({ _id: repairId });
  return result.deletedCount === 1;
}

// ─── Repairs ──────────────────────────────────────────────────────────────────

export async function getRepairById(id: string): Promise<DemoRepair | null> {
  if ((await pickBackend()) === "memory") return mem.getRepairById(id);
  await connectDB();
  const doc = await Repair.findById(id).lean();
  return doc ? toRepair(doc) : null;
}

export async function countRepairs(filter?: { status?: DemoRepairStatus | DemoRepairStatus[] }) {
  if ((await pickBackend()) === "memory") return mem.countRepairs(filter);
  await connectDB();
  const q: Record<string, unknown> = {};
  if (filter?.status) {
    q.status = Array.isArray(filter.status) ? { $in: filter.status } : filter.status;
  }
  return Repair.countDocuments(q);
}

export async function getRecentRepairs(limit: number): Promise<DemoRepair[]> {
  if ((await pickBackend()) === "memory") return mem.getRecentRepairs(limit);
  await connectDB();
  const docs = await Repair.find().sort({ createdAt: -1 }).limit(limit).lean();
  return docs.map(toRepair);
}

export async function queryRepairs(opts: {
  q?: string;
  status?: DemoRepairStatus;
  customerId?: string;
  page: number;
  pageSize: number;
}) {
  if ((await pickBackend()) === "memory") return mem.queryRepairs(opts);
  await connectDB();
  const { q, status, customerId, page, pageSize } = opts;
  const qLower = q?.trim().toLowerCase() ?? "";

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (customerId) filter.customerId = customerId;

  if (qLower) {
    const re = new RegExp(escapeRegex(qLower), "i");
    const matchingCustomers = await Customer.find({
      $or: [{ name: re }, { phone: re }],
    })
      .select("_id")
      .lean();
    const customerIds = matchingCustomers.map((c) => c._id);
    filter.$or = [
      { jobId: re },
      { imei: re },
      { issue: re },
      { deviceBrandRaw: re },
      { deviceModelRaw: re },
      { customerId: { $in: customerIds } },
    ];
  }

  const docs = await Repair.find(filter).lean();
  const rows = docs.map(toRepair);

  const customerIds = Array.from(new Set(rows.map((r) => r.customerId)));
  const customerDocs = await Customer.find({ _id: { $in: customerIds } }).lean();
  const customerMap = new Map(customerDocs.map((c) => [c._id, toCustomer(c)]));

  if (qLower) {
    rows.sort((a, b) => {
      const ca = customerMap.get(a.customerId);
      const cb = customerMap.get(b.customerId);
      const rankA = bestSequentialRank(
        [a.jobId, a.issue, a.imei, a.deviceBrandRaw, a.deviceModelRaw, ca?.name, ca?.phone],
        qLower
      );
      const rankB = bestSequentialRank(
        [b.jobId, b.issue, b.imei, b.deviceBrandRaw, b.deviceModelRaw, cb?.name, cb?.phone],
        qLower
      );
      if (rankA !== rankB) return rankA - rankB;
      const byName = compareAlphabetic(ca?.name ?? "", cb?.name ?? "");
      if (byName !== 0) return byName;
      return compareAlphabetic(a.jobId, b.jobId);
    });
  } else {
    rows.sort((a, b) => {
      const ca = customerMap.get(a.customerId);
      const cb = customerMap.get(b.customerId);
      const byName = compareAlphabetic(ca?.name ?? "", cb?.name ?? "");
      if (byName !== 0) return byName;
      return compareAlphabetic(a.jobId, b.jobId);
    });
  }

  const total = rows.length;
  const repairs = rows.slice((page - 1) * pageSize, page * pageSize);
  return { repairs, total, customerMap };
}

export async function nextJobId(): Promise<string> {
  if ((await pickBackend()) === "memory") return mem.nextJobId();
  await connectDB();
  const counter = await Counter.findByIdAndUpdate(
    "jobSeq",
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  ).lean();
  return `MRZ-${String(counter!.seq).padStart(6, "0")}`;
}

export async function createRepair(
  data: Omit<DemoRepair, "id" | "jobId" | "createdAt" | "status" | "deliveredAt" | "imageUrl"> & {
    status?: DemoRepairStatus;
    imageUrl?: string | null;
  }
): Promise<DemoRepair> {
  if ((await pickBackend()) === "memory") return mem.createRepair(data);
  await connectDB();
  const jobId = await nextJobId();
  const id = newId("rep");
  const doc = await Repair.create({
    _id: id,
    jobId,
    customerId: data.customerId,
    modelId: data.modelId,
    deviceBrandRaw: data.deviceBrandRaw,
    deviceModelRaw: data.deviceModelRaw,
    imei: data.imei,
    issue: data.issue,
    status: data.status ?? "RECEIVED",
    technicianId: data.technicianId,
    amount: data.amount,
    advancePaid: data.advancePaid ?? 0,
    deliveryDate: data.deliveryDate,
    deliveredAt: null,
    notes: data.notes,
    imageUrl: data.imageUrl ?? null,
    createdAt: new Date(),
  });
  return toRepair(doc.toObject());
}

export async function updateRepair(
  repairId: string,
  data: Partial<DemoRepair>
): Promise<DemoRepair | null> {
  if ((await pickBackend()) === "memory") return mem.updateRepair(repairId, data);
  await connectDB();
  const { id: _omitId, jobId: _omitJob, createdAt: _omitCreated, ...rest } = data;
  void _omitId;
  void _omitJob;
  void _omitCreated;
  const doc = await Repair.findByIdAndUpdate(repairId, rest, { new: true }).lean();
  return doc ? toRepair(doc) : null;
}

// ─── Enquiries ────────────────────────────────────────────────────────────────

export async function listEnquiries(status?: DemoEnquiryStatus): Promise<DemoEnquiry[]> {
  if ((await pickBackend()) === "memory") return mem.listEnquiries(status);
  await connectDB();
  const filter = status ? { status } : {};
  const docs = await Enquiry.find(filter).lean();
  const rows = docs.map(toEnquiry);
  rows.sort((a, b) => compareAlphabetic(a.name, b.name));
  return rows;
}

export async function countEnquiries(status?: DemoEnquiryStatus): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.countEnquiries(status);
  await connectDB();
  return Enquiry.countDocuments(status ? { status } : {});
}

export async function getEnquiryById(id: string): Promise<DemoEnquiry | null> {
  if ((await pickBackend()) === "memory") return mem.getEnquiryById(id);
  await connectDB();
  const doc = await Enquiry.findById(id).lean();
  return doc ? toEnquiry(doc) : null;
}

export async function createEnquiry(
  data: Omit<DemoEnquiry, "id" | "createdAt" | "status"> & { status?: DemoEnquiryStatus }
): Promise<DemoEnquiry> {
  if ((await pickBackend()) === "memory") return mem.createEnquiry(data);
  await connectDB();
  const id = newId("enq");
  const doc = await Enquiry.create({
    _id: id,
    name: data.name,
    phone: data.phone,
    device: data.device,
    issue: data.issue,
    location: data.location,
    message: data.message,
    imageUrl: data.imageUrl,
    status: data.status ?? "NEW",
    createdAt: new Date(),
  });
  return toEnquiry(doc.toObject());
}

export async function updateEnquiryStatus(
  id: string,
  status: DemoEnquiryStatus
): Promise<DemoEnquiry | null> {
  if ((await pickBackend()) === "memory") return mem.updateEnquiryStatus(id, status);
  await connectDB();
  const doc = await Enquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
  return doc ? toEnquiry(doc) : null;
}

export async function deleteEnquiry(enquiryId: string): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteEnquiry(enquiryId);
  await connectDB();
  const result = await Enquiry.deleteOne({ _id: enquiryId });
  return result.deletedCount === 1;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export async function writeAudit(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: unknown;
}) {
  if ((await pickBackend()) === "memory") return mem.writeAudit(input);
  await connectDB();
  await AuditLog.create({
    _id: newId("audit"),
    ...input,
    timestamp: new Date(),
  });
}

export async function createCourseNotify(data: { name: string; contact: string }) {
  if ((await pickBackend()) === "memory") return mem.createCourseNotify(data);
  await connectDB();
  const id = newId("course");
  await CourseNotify.create({ _id: id, ...data, createdAt: new Date() });
  return id;
}

export async function getRepairCount(): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.getRepairCount();
  await connectDB();
  return Repair.countDocuments();
}
