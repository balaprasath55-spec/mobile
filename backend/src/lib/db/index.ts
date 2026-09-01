import { buildCatalogSeed } from "@/lib/db/catalog-seed";
import type {
  DemoAttendance,
  DemoAttendanceStatus,
  DemoCustomer,
  DemoEmployee,
  DemoEnquiry,
  DemoEnquiryStatus,
  DemoEstimate,
  DemoIssue,
  DemoBrand,
  DemoModel,
  DemoRepair,
  DemoRepairStatus,
} from "@/lib/demo-store";
import { DUMMY_EMPLOYEES } from "@/lib/employees-seed";
import { normalizeRepairIntakeChecks } from "@/lib/repair-intake";
import { buildShopRecords } from "@/lib/shop-data";
import { compareAlphabetic, bestSequentialRank } from "@/lib/search-utils";
import { connectDB } from "@/lib/mongodb";
import { pickBackend } from "@/lib/db/backend";
import * as mem from "@/lib/memory-store";
import {
  Attendance,
  AuditLog,
  Brand,
  Counter,
  CourseNotify,
  Customer,
  DeviceModel,
  Employee,
  Enquiry,
  Estimate,
  Issue,
  Repair,
  type AttendanceDoc,
  type CustomerDoc,
  type EmployeeDoc,
  type EnquiryDoc,
  type RepairDoc,
} from "@/lib/models";

const NOT_DELETED = { isDeleted: { $ne: true } } as const;

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

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

function toCustomer(doc: CustomerDoc): DemoCustomer {
  return {
    id: doc._id,
    name: doc.name,
    phone: doc.phone,
    altPhone: doc.altPhone ?? null,
    address: doc.address ?? null,
    location: doc.location ?? null,
    createdAt: doc.createdAt,
    ...softDeleteFields(doc),
  };
}

function toRepair(doc: RepairDoc): DemoRepair {
  return {
    id: doc._id,
    jobId: doc.jobId,
    customerId: doc.customerId,
    source: (doc.source as DemoRepair["source"]) ?? "WALK_IN",
    dealerId: doc.dealerId ?? null,
    batchId: doc.batchId ?? null,
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
    intakeChecks: normalizeRepairIntakeChecks(doc.intakeChecks),
    createdAt: doc.createdAt,
    ...softDeleteFields(doc),
  };
}

function toEnquiry(doc: EnquiryDoc): DemoEnquiry {
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
    ...softDeleteFields(doc),
  };
}

function toEmployee(doc: EmployeeDoc): DemoEmployee {
  return {
    id: doc._id,
    name: doc.name,
    role: doc.role,
    phone: doc.phone,
    isActive: doc.isActive ?? true,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt ?? doc.createdAt,
    isDeleted: Boolean(doc.isDeleted),
    deletedAt: doc.deletedAt ?? null,
  };
}

function toAttendance(doc: AttendanceDoc): DemoAttendance {
  return {
    id: doc._id,
    employeeId: doc.employeeId,
    date: doc.date,
    status: doc.status as DemoAttendanceStatus,
    notes: doc.notes ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt ?? doc.createdAt,
    isDeleted: Boolean(doc.isDeleted),
    deletedAt: doc.deletedAt ?? null,
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
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
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
      isDeleted: c.isDeleted,
      deletedAt: c.deletedAt,
      updatedAt: c.updatedAt,
    }))
  );
  await Repair.insertMany(
    repairs.map((r) => ({
      _id: r.id,
      jobId: r.jobId,
      customerId: r.customerId,
      source: r.source,
      dealerId: r.dealerId,
      batchId: r.batchId,
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
      intakeChecks: r.intakeChecks,
      createdAt: r.createdAt,
      isDeleted: r.isDeleted,
      deletedAt: r.deletedAt,
      updatedAt: r.updatedAt,
    }))
  );
  await Counter.create({ _id: "jobSeq", seq: jobSeq });

  const empCount = await Employee.estimatedDocumentCount();
  if (empCount === 0) {
    const now = new Date();
    await Employee.insertMany(
      DUMMY_EMPLOYEES.map((e) => ({
        _id: e.id,
        name: e.name,
        role: e.role,
        phone: e.phone,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        deletedAt: null,
      }))
    );
  }

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
  const doc = await Customer.findOne({ _id: id, ...NOT_DELETED }).lean();
  return doc ? toCustomer(doc) : null;
}

export async function findCustomerByPhone(phone: string): Promise<DemoCustomer | null> {
  if ((await pickBackend()) === "memory") return mem.findCustomerByPhone(phone);
  await connectDB();
  const doc = await Customer.findOne({ phone, ...NOT_DELETED }).lean();
  return doc ? toCustomer(doc) : null;
}

export async function countCustomers(): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.countCustomers();
  await connectDB();
  return Customer.countDocuments(NOT_DELETED);
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

  const filter: Record<string, unknown> = { ...NOT_DELETED };
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
  const docs = await Repair.find({ customerId, ...NOT_DELETED }).sort({ createdAt: -1 }).lean();
  return docs.map(toRepair);
}

export async function createCustomer(
  data: Omit<DemoCustomer, "id" | "createdAt" | "isDeleted" | "deletedAt" | "updatedAt">
): Promise<DemoCustomer> {
  if ((await pickBackend()) === "memory") return mem.createCustomer(data);
  await connectDB();
  const id = newId("cust");
  const now = new Date();
  const doc = await Customer.create({
    _id: id,
    ...data,
    createdAt: now,
    isDeleted: false,
    deletedAt: null,
    updatedAt: now,
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
  const doc = await Customer.findOneAndUpdate(
    { _id: customerId, ...NOT_DELETED },
    { ...rest, updatedAt: new Date() },
    { new: true }
  ).lean();
  return doc ? toCustomer(doc) : null;
}

export async function deleteCustomer(customerId: string, cascade = false): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteCustomer(customerId, cascade);
  await connectDB();
  if (cascade) {
    await Repair.updateMany(
      { customerId, ...NOT_DELETED },
      { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() }
    );
  } else {
    const hasRepairs = await Repair.exists({ customerId, ...NOT_DELETED });
    if (hasRepairs) return false;
  }
  const result = await Customer.updateOne(
    { _id: customerId, ...NOT_DELETED },
    { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() }
  );
  return result.modifiedCount === 1;
}

export async function deleteRepair(repairId: string): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteRepair(repairId);
  await connectDB();
  const result = await Repair.updateOne(
    { _id: repairId, ...NOT_DELETED },
    { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() }
  );
  return result.modifiedCount === 1;
}

// ─── Repairs ──────────────────────────────────────────────────────────────────

export async function getRepairById(id: string): Promise<DemoRepair | null> {
  if ((await pickBackend()) === "memory") return mem.getRepairById(id);
  await connectDB();
  const doc = await Repair.findOne({ _id: id, ...NOT_DELETED }).lean();
  return doc ? toRepair(doc) : null;
}

export async function countRepairs(filter?: {
  status?: DemoRepairStatus | DemoRepairStatus[];
  walkInOnly?: boolean;
}) {
  if ((await pickBackend()) === "memory") return mem.countRepairs(filter);
  await connectDB();
  const q: Record<string, unknown> = { ...NOT_DELETED };
  if (filter?.walkInOnly) q.dealerId = null;
  if (filter?.status) {
    q.status = Array.isArray(filter.status) ? { $in: filter.status } : filter.status;
  }
  return Repair.countDocuments(q);
}

export async function getRecentRepairs(limit: number): Promise<DemoRepair[]> {
  if ((await pickBackend()) === "memory") return mem.getRecentRepairs(limit);
  await connectDB();
  const docs = await Repair.find({ ...NOT_DELETED, dealerId: null })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(toRepair);
}

export async function queryRepairs(opts: {
  q?: string;
  status?: DemoRepairStatus;
  customerId?: string;
  dealerId?: string;
  batchId?: string;
  jobSource?: "WALK_IN" | "DEALER" | "ALL";
  page: number;
  pageSize: number;
}) {
  if ((await pickBackend()) === "memory") return mem.queryRepairs(opts);
  await connectDB();
  const { q, status, customerId, dealerId, batchId, jobSource, page, pageSize } = opts;
  const qLower = q?.trim().toLowerCase() ?? "";

  const filter: Record<string, unknown> = { ...NOT_DELETED };
  if (jobSource === "WALK_IN") filter.dealerId = null;
  else if (jobSource === "DEALER") filter.dealerId = { $ne: null };
  if (status) filter.status = status;
  if (customerId) filter.customerId = customerId;
  if (dealerId) filter.dealerId = dealerId;
  if (batchId) filter.batchId = batchId;

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
  data: Omit<
    DemoRepair,
    "id" | "jobId" | "createdAt" | "status" | "deliveredAt" | "imageUrl" | "isDeleted" | "deletedAt" | "updatedAt"
  > & {
    status?: DemoRepairStatus;
    imageUrl?: string | null;
  }
): Promise<DemoRepair> {
  if ((await pickBackend()) === "memory") return mem.createRepair(data);
  await connectDB();
  const jobId = await nextJobId();
  const id = newId("rep");
  const now = new Date();
  const doc = await Repair.create({
    _id: id,
    jobId,
    customerId: data.customerId,
    source: data.source ?? "WALK_IN",
    dealerId: data.dealerId ?? null,
    batchId: data.batchId ?? null,
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
    intakeChecks: normalizeRepairIntakeChecks(data.intakeChecks),
    createdAt: now,
    isDeleted: false,
    deletedAt: null,
    updatedAt: now,
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
  if (rest.intakeChecks) rest.intakeChecks = normalizeRepairIntakeChecks(rest.intakeChecks);
  const patch: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (rest.status === "DELIVERED") patch.deliveredAt = new Date();
  const doc = await Repair.findOneAndUpdate({ _id: repairId, ...NOT_DELETED }, patch, { new: true }).lean();
  return doc ? toRepair(doc) : null;
}

// ─── Enquiries ────────────────────────────────────────────────────────────────

export async function listEnquiries(status?: DemoEnquiryStatus): Promise<DemoEnquiry[]> {
  if ((await pickBackend()) === "memory") return mem.listEnquiries(status);
  await connectDB();
  const filter = status ? { status, ...NOT_DELETED } : { ...NOT_DELETED };
  const docs = await Enquiry.find(filter).lean();
  const rows = docs.map(toEnquiry);
  rows.sort((a, b) => compareAlphabetic(a.name, b.name));
  return rows;
}

export async function countEnquiries(status?: DemoEnquiryStatus): Promise<number> {
  if ((await pickBackend()) === "memory") return mem.countEnquiries(status);
  await connectDB();
  return Enquiry.countDocuments(status ? { status, ...NOT_DELETED } : { ...NOT_DELETED });
}

export async function getEnquiryById(id: string): Promise<DemoEnquiry | null> {
  if ((await pickBackend()) === "memory") return mem.getEnquiryById(id);
  await connectDB();
  const doc = await Enquiry.findOne({ _id: id, ...NOT_DELETED }).lean();
  return doc ? toEnquiry(doc) : null;
}

export async function createEnquiry(
  data: Omit<DemoEnquiry, "id" | "createdAt" | "status" | "isDeleted" | "deletedAt" | "updatedAt"> & {
    status?: DemoEnquiryStatus;
  }
): Promise<DemoEnquiry> {
  if ((await pickBackend()) === "memory") return mem.createEnquiry(data);
  await connectDB();
  const id = newId("enq");
  const now = new Date();
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
    createdAt: now,
    isDeleted: false,
    deletedAt: null,
    updatedAt: now,
  });
  return toEnquiry(doc.toObject());
}

export async function updateEnquiryStatus(
  id: string,
  status: DemoEnquiryStatus
): Promise<DemoEnquiry | null> {
  if ((await pickBackend()) === "memory") return mem.updateEnquiryStatus(id, status);
  await connectDB();
  const doc = await Enquiry.findOneAndUpdate(
    { _id: id, ...NOT_DELETED },
    { status, updatedAt: new Date() },
    { new: true }
  ).lean();
  return doc ? toEnquiry(doc) : null;
}

export async function deleteEnquiry(enquiryId: string): Promise<boolean> {
  if ((await pickBackend()) === "memory") return mem.deleteEnquiry(enquiryId);
  await connectDB();
  const result = await Enquiry.updateOne(
    { _id: enquiryId, ...NOT_DELETED },
    { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() }
  );
  return result.modifiedCount === 1;
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
  return Repair.countDocuments(NOT_DELETED);
}

// ─── Employees & attendance ───────────────────────────────────────────────────

export async function listEmployees(): Promise<DemoEmployee[]> {
  if ((await pickBackend()) === "memory") return mem.listEmployees();
  await connectDB();
  let docs = await Employee.find({ ...NOT_DELETED, isActive: true }).sort({ name: 1 }).lean();
  if (docs.length === 0) {
    const now = new Date();
    await Employee.insertMany(
      DUMMY_EMPLOYEES.map((e) => ({
        _id: e.id,
        name: e.name,
        role: e.role,
        phone: e.phone,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        deletedAt: null,
      }))
    );
    docs = await Employee.find({ ...NOT_DELETED, isActive: true }).sort({ name: 1 }).lean();
  }
  return docs.map(toEmployee);
}

export async function getAttendanceForDate(date: string) {
  if ((await pickBackend()) === "memory") return mem.getAttendanceForDate(date);
  await connectDB();
  const employees = await listEmployees();
  const docs = await Attendance.find({ date, ...NOT_DELETED }).lean();
  return { date, employees, records: docs.map(toAttendance) };
}

export async function upsertAttendanceBulk(input: {
  date: string;
  records: { employeeId: string; status: DemoAttendanceStatus; notes?: string | null }[];
}) {
  if ((await pickBackend()) === "memory") return mem.upsertAttendanceBulk(input);
  await connectDB();
  const now = new Date();
  const saved: DemoAttendance[] = [];
  for (const row of input.records) {
    const doc = await Attendance.findOneAndUpdate(
      { employeeId: row.employeeId, date: input.date, ...NOT_DELETED },
      {
        status: row.status,
        notes: row.notes ?? null,
        updatedAt: now,
        $setOnInsert: {
          _id: newId("att"),
          employeeId: row.employeeId,
          date: input.date,
          createdAt: now,
          isDeleted: false,
          deletedAt: null,
        },
      },
      { upsert: true, new: true }
    ).lean();
    saved.push(toAttendance(doc));
  }
  return saved;
}

export async function buildAttendanceCsv(from: string, to: string): Promise<string> {
  if ((await pickBackend()) === "memory") return mem.buildAttendanceCsv(from, to);
  await connectDB();
  const employees = await listEmployees();
  const byEmp = new Map(employees.map((e) => [e.id, e]));
  const docs = await Attendance.find({
    date: { $gte: from, $lte: to },
    ...NOT_DELETED,
  })
    .sort({ date: 1, employeeId: 1 })
    .lean();
  const labels: Record<DemoAttendanceStatus, string> = {
    PRESENT: "Present",
    ABSENT: "Absent",
    HALF_DAY: "Half day",
    LEAVE: "Leave",
  };
  const csvCell = (value: string) =>
    /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const formatCsvDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return y && m && d ? `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}` : iso;
  };
  const csvCellExcel = (value: string, asText = false) => {
    const v = asText && value ? `\t${value}` : value;
    return `"${v.replace(/"/g, '""')}"`;
  };
  const header = ["Date", "Employee", "Role", "Phone", "Status", "Notes"].map(csvCell).join(",");
  const lines = docs.map((rec) => {
    const emp = byEmp.get(rec.employeeId);
    return [
      csvCellExcel(formatCsvDate(rec.date)),
      csvCell(emp?.name ?? rec.employeeId),
      csvCell(emp?.role ?? ""),
      csvCellExcel(emp?.phone ?? "", true),
      csvCell(labels[rec.status as DemoAttendanceStatus]),
      csvCell(rec.notes ?? ""),
    ].join(",");
  });
  return [header, ...lines].join("\r\n");
}
