/**
 * In-memory fallback when MongoDB is unreachable (e.g. DNS/SRV issues on Windows).
 */
import { buildCatalogSeed } from "@/lib/db/catalog-seed";
import type {
  DemoAttendance,
  DemoAttendanceStatus,
  DemoBrand,
  DemoCustomer,
  DemoDealer,
  DemoDealerBatch,
  DemoEmployee,
  DemoEnquiry,
  DemoEnquiryStatus,
  DemoEstimate,
  DemoIssue,
  DemoModel,
  DemoRepair,
  DemoRepairStatus,
} from "@/lib/demo-store";
import { DUMMY_EMPLOYEES } from "@/lib/employees-seed";
import { normalizeRepairIntakeChecks } from "@/lib/repair-intake";
import { buildShopRecords } from "@/lib/shop-data";
import { bestSequentialRank, compareAlphabetic } from "@/lib/search-utils";

type Store = {
  customers: DemoCustomer[];
  repairs: DemoRepair[];
  dealers: DemoDealer[];
  dealerBatches: DemoDealerBatch[];
  enquiries: DemoEnquiry[];
  employees: DemoEmployee[];
  attendance: DemoAttendance[];
  brands: DemoBrand[];
  models: DemoModel[];
  issues: DemoIssue[];
  estimates: DemoEstimate[];
  courseNotifies: { id: string; name: string; contact: string; createdAt: Date }[];
  auditLogs: {
    id: string;
    adminUserId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: unknown;
    timestamp: Date;
  }[];
  jobSeq: number;
  dealerBatchSeq: number;
};

const globalMem = globalThis as unknown as { __mrMemStore?: Store };

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function auditFields(createdAt: Date) {
  return { isDeleted: false, deletedAt: null, updatedAt: createdAt };
}

function seedEmployees(): DemoEmployee[] {
  const now = new Date();
  return DUMMY_EMPLOYEES.map((e) => ({
    ...e,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    deletedAt: null,
  }));
}

function seed(): Store {
  const { brands, models, issues, estimates } = buildCatalogSeed();
  const { customers, repairs, jobSeq } = buildShopRecords();
  return {
    customers,
    repairs,
    dealers: [],
    dealerBatches: [],
    enquiries: [],
    employees: seedEmployees(),
    attendance: [],
    brands,
    models,
    issues,
    estimates,
    courseNotifies: [],
    auditLogs: [],
    jobSeq,
    dealerBatchSeq: 1,
  };
}

function getStore(): Store {
  if (!globalMem.__mrMemStore) globalMem.__mrMemStore = seed();
  const s = globalMem.__mrMemStore;
  if (!Array.isArray(s.dealers)) s.dealers = [];
  if (!Array.isArray(s.dealerBatches)) s.dealerBatches = [];
  if (!Array.isArray(s.employees) || s.employees.length === 0) s.employees = seedEmployees();
  if (!Array.isArray(s.attendance)) s.attendance = [];
  if (typeof s.dealerBatchSeq !== "number") s.dealerBatchSeq = 1;
  return s;
}

export function ensureSeeded() {
  getStore();
}

export async function listBrands(): Promise<DemoBrand[]> {
  return getStore()
    .brands.filter((b) => b.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function listModels(brandId?: string): Promise<DemoModel[]> {
  const s = getStore();
  return s.models
    .filter((m) => m.isActive && (!brandId || m.brandId === brandId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function listIssues(modelId?: string): Promise<DemoIssue[]> {
  const s = getStore();
  if (modelId) {
    const issueIds = new Set(s.estimates.filter((e) => e.modelId === modelId && e.isActive).map((e) => e.issueId));
    return s.issues.filter((i) => i.isActive && issueIds.has(i.id)).sort((a, b) => a.name.localeCompare(b.name));
  }
  return s.issues.filter((i) => i.isActive).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEstimate(modelId: string, issueId: string): Promise<DemoEstimate | null> {
  return (
    getStore().estimates.find((e) => e.modelId === modelId && e.issueId === issueId && e.isActive) ?? null
  );
}

export async function getBrandName(brandId: string) {
  return getStore().brands.find((b) => b.id === brandId)?.name;
}

export async function getModelWithBrand(modelId: string | null) {
  if (!modelId) return null;
  const s = getStore();
  const model = s.models.find((m) => m.id === modelId);
  if (!model) return null;
  const brand = s.brands.find((b) => b.id === model.brandId);
  if (!brand) return null;
  return { ...model, brand };
}

export async function getCustomerById(id: string) {
  return getStore().customers.find((c) => c.id === id && !c.isDeleted) ?? null;
}

export async function findCustomerByPhone(phone: string) {
  return getStore().customers.find((c) => c.phone === phone && !c.isDeleted) ?? null;
}

export async function countCustomers() {
  return getStore().customers.filter((c) => !c.isDeleted).length;
}

export async function queryCustomers(opts: {
  q?: string;
  location?: string;
  page: number;
  pageSize: number;
}) {
  const s = getStore();
  const qLower = opts.q?.trim().toLowerCase() ?? "";
  const locLower = opts.location?.trim().toLowerCase() ?? "";
  let rows = s.customers.filter((c) => !c.isDeleted);

  if (qLower) {
    rows = rows.filter((c) => {
      const repairs = s.repairs.filter((r) => r.customerId === c.id && !r.isDeleted);
      return (
        c.name.toLowerCase().includes(qLower) ||
        c.phone.includes(qLower) ||
        (c.location ?? "").toLowerCase().includes(qLower) ||
        repairs.some((r) => r.jobId.toLowerCase().includes(qLower) || (r.imei ?? "").includes(qLower))
      );
    });
    rows.sort((a, b) => {
      const repairsA = s.repairs.filter((r) => r.customerId === a.id && !r.isDeleted);
      const repairsB = s.repairs.filter((r) => r.customerId === b.id && !r.isDeleted);
      const rankA = bestSequentialRank([a.name, a.phone, a.location, ...repairsA.map((r) => r.jobId)], qLower);
      const rankB = bestSequentialRank([b.name, b.phone, b.location, ...repairsB.map((r) => r.jobId)], qLower);
      if (rankA !== rankB) return rankA - rankB;
      return compareAlphabetic(a.name, b.name);
    });
  } else {
    rows.sort((a, b) => compareAlphabetic(a.name, b.name));
  }
  if (locLower) rows = rows.filter((c) => (c.location ?? "").toLowerCase().includes(locLower));

  const total = rows.length;
  return { customers: rows.slice((opts.page - 1) * opts.pageSize, opts.page * opts.pageSize), total };
}

export async function getRepairsForCustomer(customerId: string) {
  return getStore()
    .repairs.filter((r) => r.customerId === customerId && !r.isDeleted)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createCustomer(
  data: Omit<DemoCustomer, "id" | "createdAt" | "isDeleted" | "deletedAt" | "updatedAt">
) {
  const now = new Date();
  const customer: DemoCustomer = { ...data, id: newId("cust"), createdAt: now, ...auditFields(now) };
  getStore().customers.unshift(customer);
  return customer;
}

export async function updateCustomer(customerId: string, data: Partial<DemoCustomer>) {
  const s = getStore();
  const idx = s.customers.findIndex((c) => c.id === customerId && !c.isDeleted);
  if (idx < 0) return null;
  s.customers[idx] = { ...s.customers[idx], ...data, id: customerId, updatedAt: new Date() };
  return s.customers[idx];
}

export async function deleteCustomer(customerId: string, cascade = false) {
  const s = getStore();
  const customer = s.customers.find((c) => c.id === customerId && !c.isDeleted);
  if (!customer) return false;
  const activeRepairs = s.repairs.filter((r) => r.customerId === customerId && !r.isDeleted);
  if (!cascade && activeRepairs.length > 0) return false;
  const now = new Date();
  if (cascade) {
    for (const repair of activeRepairs) {
      repair.isDeleted = true;
      repair.deletedAt = now;
      repair.updatedAt = now;
    }
  }
  customer.isDeleted = true;
  customer.deletedAt = now;
  customer.updatedAt = now;
  return true;
}

export async function deleteRepair(repairId: string) {
  const s = getStore();
  const repair = s.repairs.find((r) => r.id === repairId && !r.isDeleted);
  if (!repair) return false;
  const now = new Date();
  repair.isDeleted = true;
  repair.deletedAt = now;
  repair.updatedAt = now;
  return true;
}

export async function getRepairById(id: string) {
  return getStore().repairs.find((r) => r.id === id && !r.isDeleted) ?? null;
}

export async function countRepairs(filter?: {
  status?: DemoRepairStatus | DemoRepairStatus[];
  walkInOnly?: boolean;
}) {
  let rows = getStore().repairs.filter((r) => !r.isDeleted);
  if (filter?.walkInOnly) rows = rows.filter((r) => !r.dealerId);
  if (filter?.status) {
    const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
    rows = rows.filter((r) => statuses.includes(r.status));
  }
  return rows.length;
}

export async function getRecentRepairs(limit: number) {
  return [...getStore().repairs]
    .filter((r) => !r.isDeleted && !r.dealerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
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
  const s = getStore();
  const qLower = opts.q?.trim().toLowerCase() ?? "";
  let rows = s.repairs.filter((r) => !r.isDeleted);
  if (opts.jobSource === "WALK_IN") rows = rows.filter((r) => !r.dealerId);
  else if (opts.jobSource === "DEALER") rows = rows.filter((r) => Boolean(r.dealerId));
  if (opts.status) rows = rows.filter((r) => r.status === opts.status);
  if (opts.customerId) rows = rows.filter((r) => r.customerId === opts.customerId);
  if (opts.dealerId) rows = rows.filter((r) => r.dealerId === opts.dealerId);
  if (opts.batchId) rows = rows.filter((r) => r.batchId === opts.batchId);
  if (qLower) {
    rows = rows.filter((r) => {
      const customer = s.customers.find((c) => c.id === r.customerId);
      return (
        r.jobId.toLowerCase().includes(qLower) ||
        (r.imei ?? "").includes(qLower) ||
        r.issue.toLowerCase().includes(qLower) ||
        (r.deviceBrandRaw ?? "").toLowerCase().includes(qLower) ||
        (r.deviceModelRaw ?? "").toLowerCase().includes(qLower) ||
        (customer?.name.toLowerCase().includes(qLower) ?? false) ||
        (customer?.phone.includes(qLower) ?? false)
      );
    });
  }

  const customerMap = new Map(s.customers.filter((c) => !c.isDeleted).map((c) => [c.id, c]));
  if (qLower) {
    rows.sort((a, b) => {
      const ca = customerMap.get(a.customerId);
      const cb = customerMap.get(b.customerId);
      const rankA = bestSequentialRank([a.jobId, a.issue, ca?.name, ca?.phone], qLower);
      const rankB = bestSequentialRank([b.jobId, b.issue, cb?.name, cb?.phone], qLower);
      if (rankA !== rankB) return rankA - rankB;
      return compareAlphabetic(ca?.name ?? "", cb?.name ?? "");
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
  const repairs = rows.slice((opts.page - 1) * opts.pageSize, opts.page * opts.pageSize);
  return { repairs, total, customerMap };
}

export async function nextJobId() {
  const s = getStore();
  const jobId = `MRZ-${String(s.jobSeq).padStart(6, "0")}`;
  s.jobSeq += 1;
  return jobId;
}

export async function createRepair(
  data: Omit<
    DemoRepair,
    "id" | "jobId" | "createdAt" | "status" | "deliveredAt" | "imageUrl" | "isDeleted" | "deletedAt" | "updatedAt"
  > & {
    status?: DemoRepairStatus;
    imageUrl?: string | null;
  }
) {
  const now = new Date();
  const repair: DemoRepair = {
    source: data.source ?? "WALK_IN",
    dealerId: data.dealerId ?? null,
    batchId: data.batchId ?? null,
    customerId: data.customerId,
    modelId: data.modelId,
    deviceBrandRaw: data.deviceBrandRaw,
    deviceModelRaw: data.deviceModelRaw,
    imei: data.imei,
    issue: data.issue,
    technicianId: data.technicianId,
    amount: data.amount,
    advancePaid: data.advancePaid ?? 0,
    notes: data.notes,
    deliveryDate: data.deliveryDate,
    intakeChecks: normalizeRepairIntakeChecks(data.intakeChecks),
    id: newId("rep"),
    jobId: await nextJobId(),
    status: data.status ?? "RECEIVED",
    deliveredAt: null,
    imageUrl: data.imageUrl ?? null,
    createdAt: now,
    ...auditFields(now),
  };
  getStore().repairs.unshift(repair);
  return repair;
}

export async function updateRepair(repairId: string, data: Partial<DemoRepair>) {
  const s = getStore();
  const idx = s.repairs.findIndex((r) => r.id === repairId && !r.isDeleted);
  if (idx < 0) return null;
  const next = { ...s.repairs[idx], ...data, id: repairId, jobId: s.repairs[idx].jobId, updatedAt: new Date() };
  if (data.status === "DELIVERED" && !next.deliveredAt) next.deliveredAt = new Date();
  if (data.intakeChecks) next.intakeChecks = normalizeRepairIntakeChecks(data.intakeChecks);
  s.repairs[idx] = next;
  return s.repairs[idx];
}

export async function listEnquiries(status?: DemoEnquiryStatus) {
  let rows = getStore().enquiries.filter((e) => !e.isDeleted && (!status || e.status === status));
  rows = [...rows].sort((a, b) => compareAlphabetic(a.name, b.name));
  return rows;
}

export async function countEnquiries(status?: DemoEnquiryStatus) {
  return getStore().enquiries.filter((e) => !e.isDeleted && (!status || e.status === status)).length;
}

export async function getEnquiryById(id: string) {
  return getStore().enquiries.find((e) => e.id === id && !e.isDeleted) ?? null;
}

export async function createEnquiry(
  data: Omit<DemoEnquiry, "id" | "createdAt" | "status" | "isDeleted" | "deletedAt" | "updatedAt"> & {
    status?: DemoEnquiryStatus;
  }
) {
  const now = new Date();
  const enquiry: DemoEnquiry = {
    ...data,
    id: newId("enq"),
    status: data.status ?? "NEW",
    createdAt: now,
    ...auditFields(now),
  };
  getStore().enquiries.unshift(enquiry);
  return enquiry;
}

export async function updateEnquiryStatus(id: string, status: DemoEnquiryStatus) {
  const s = getStore();
  const enquiry = s.enquiries.find((e) => e.id === id && !e.isDeleted);
  if (!enquiry) return null;
  enquiry.status = status;
  enquiry.updatedAt = new Date();
  return enquiry;
}

export async function deleteEnquiry(enquiryId: string) {
  const s = getStore();
  const enquiry = s.enquiries.find((e) => e.id === enquiryId && !e.isDeleted);
  if (!enquiry) return false;
  const now = new Date();
  enquiry.isDeleted = true;
  enquiry.deletedAt = now;
  enquiry.updatedAt = now;
  return true;
}

export async function writeAudit(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: unknown;
}) {
  getStore().auditLogs.unshift({
    id: newId("audit"),
    ...input,
    timestamp: new Date(),
  });
}

export async function createCourseNotify(data: { name: string; contact: string }) {
  const id = newId("course");
  getStore().courseNotifies.unshift({ id, ...data, createdAt: new Date() });
  return id;
}

export async function getRepairCount() {
  return getStore().repairs.filter((r) => !r.isDeleted).length;
}

export async function listEmployees(): Promise<DemoEmployee[]> {
  const s = getStore();
  if (!Array.isArray(s.employees) || s.employees.length === 0) s.employees = seedEmployees();
  return s.employees.filter((e) => !e.isDeleted && e.isActive).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAttendanceForDate(date: string) {
  const employees = await listEmployees();
  const records = getStore().attendance.filter((a) => a.date === date && !a.isDeleted);
  return { date, employees, records };
}

export async function upsertAttendanceBulk(input: {
  date: string;
  records: { employeeId: string; status: DemoAttendanceStatus; notes?: string | null }[];
}) {
  const s = getStore();
  const now = new Date();
  const saved: DemoAttendance[] = [];

  for (const row of input.records) {
    const idx = s.attendance.findIndex(
      (a) => a.employeeId === row.employeeId && a.date === input.date && !a.isDeleted
    );
    if (idx >= 0) {
      s.attendance[idx] = {
        ...s.attendance[idx],
        status: row.status,
        notes: row.notes ?? null,
        updatedAt: now,
      };
      saved.push(s.attendance[idx]);
    } else {
      const record: DemoAttendance = {
        id: newId("att"),
        employeeId: row.employeeId,
        date: input.date,
        status: row.status,
        notes: row.notes ?? null,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        deletedAt: null,
      };
      s.attendance.unshift(record);
      saved.push(record);
    }
  }

  return saved;
}

const ATTENDANCE_STATUS_LABELS: Record<DemoAttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half day",
  LEAVE: "Leave",
};

function csvCell(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function formatCsvDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

function csvCellExcel(value: string, asText = false) {
  const v = asText && value ? `\t${value}` : value;
  return `"${v.replace(/"/g, '""')}"`;
}

export async function buildAttendanceCsv(from: string, to: string): Promise<string> {
  const employees = await listEmployees();
  const byEmp = new Map(employees.map((e) => [e.id, e]));
  const records = getStore().attendance.filter(
    (a) => !a.isDeleted && a.date >= from && a.date <= to
  );
  records.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    const ea = byEmp.get(a.employeeId);
    const eb = byEmp.get(b.employeeId);
    return (ea?.name ?? "").localeCompare(eb?.name ?? "");
  });

  const header = ["Date", "Employee", "Role", "Phone", "Status", "Notes"]
    .map(csvCell)
    .join(",");
  const lines = records.map((rec) => {
    const emp = byEmp.get(rec.employeeId);
    return [
      csvCellExcel(formatCsvDate(rec.date)),
      csvCell(rec.employeeId in Object.fromEntries(employees.map((e) => [e.id, e])) ? emp?.name ?? rec.employeeId : rec.employeeId),
      csvCell(emp?.role ?? ""),
      csvCellExcel(emp?.phone ?? "", true),
      csvCell(ATTENDANCE_STATUS_LABELS[rec.status]),
      csvCell(rec.notes ?? ""),
    ].join(",");
  });
  return [header, ...lines].join("\r\n");
}

export function isMemoryBackend() {
  return Boolean(globalMem.__mrMemStore);
}

// ─── Dealers ─────────────────────────────────────────────────────────────────

export async function queryDealers(opts: { q?: string; page: number; pageSize: number }) {
  const qLower = opts.q?.trim().toLowerCase() ?? "";
  let rows = getStore().dealers.filter((d) => !d.isDeleted);
  if (qLower) {
    rows = rows.filter(
      (d) =>
        d.name.toLowerCase().includes(qLower) ||
        d.shopName.toLowerCase().includes(qLower) ||
        d.phone.includes(qLower) ||
        (d.location ?? "").toLowerCase().includes(qLower)
    );
  }
  rows.sort((a, b) => compareAlphabetic(a.shopName, b.shopName));
  const total = rows.length;
  return { dealers: rows.slice((opts.page - 1) * opts.pageSize, opts.page * opts.pageSize), total };
}

export async function getDealerById(id: string) {
  return getStore().dealers.find((d) => d.id === id && !d.isDeleted) ?? null;
}

export async function createDealer(data: {
  name: string;
  shopName: string;
  phone: string;
  location?: string | null;
  notes?: string | null;
}) {
  const s = getStore();
  const now = new Date();
  const phone = data.phone.replace(/\s+/g, "");
  const customer: DemoCustomer = {
    id: newId("cust"),
    name: data.shopName.trim(),
    phone,
    altPhone: null,
    address: null,
    location: data.location?.trim() || null,
    createdAt: now,
    ...auditFields(now),
  };
  s.customers.unshift(customer);
  const dealer: DemoDealer = {
    id: newId("dealer"),
    name: data.name.trim(),
    shopName: data.shopName.trim(),
    phone,
    location: data.location?.trim() || null,
    notes: data.notes?.trim() || null,
    customerId: customer.id,
    createdAt: now,
    ...auditFields(now),
  };
  s.dealers.unshift(dealer);
  return dealer;
}

export async function updateDealer(
  id: string,
  data: { name: string; shopName: string; phone: string; location?: string | null; notes?: string | null }
) {
  const s = getStore();
  const idx = s.dealers.findIndex((d) => d.id === id && !d.isDeleted);
  if (idx < 0) return null;
  s.dealers[idx] = {
    ...s.dealers[idx],
    name: data.name.trim(),
    shopName: data.shopName.trim(),
    phone: data.phone.replace(/\s+/g, ""),
    location: data.location?.trim() || null,
    notes: data.notes?.trim() || null,
    updatedAt: new Date(),
  };
  return s.dealers[idx];
}

export async function listDealerBatches(dealerId: string) {
  return getStore()
    .dealerBatches.filter((b) => b.dealerId === dealerId && !b.isDeleted)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getDealerBatchById(id: string) {
  return getStore().dealerBatches.find((b) => b.id === id && !b.isDeleted) ?? null;
}

export async function nextDealerBatchRef() {
  const s = getStore();
  const ref = `DLR-${String(s.dealerBatchSeq).padStart(6, "0")}`;
  s.dealerBatchSeq += 1;
  return ref;
}

export async function createDealerBatch(
  dealerId: string,
  data: {
    notes?: string | null;
    devices: {
      deviceBrandRaw?: string | null;
      deviceModelRaw: string;
      modelId?: string | null;
      issue: string;
      imei?: string | null;
      intakeChecks?: DemoRepair["intakeChecks"];
    }[];
  }
) {
  const dealer = await getDealerById(dealerId);
  if (!dealer) return null;
  const s = getStore();
  const now = new Date();
  const batchId = newId("dbatch");
  const batchRef = await nextDealerBatchRef();
  const batchNotes = data.notes?.trim() || null;
  const repairs: DemoRepair[] = [];

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

  const batch: DemoDealerBatch = {
    id: batchId,
    dealerId: dealer.id,
    batchRef,
    notes: batchNotes,
    deviceCount: repairs.length,
    createdAt: now,
    ...auditFields(now),
  };
  s.dealerBatches.unshift(batch);
  return { batch, repairs };
}

export async function countDealerPendingJobs(dealerId: string) {
  return getStore().repairs.filter(
    (r) => !r.isDeleted && r.dealerId === dealerId && (r.status === "RECEIVED" || r.status === "IN_REPAIR")
  ).length;
}
