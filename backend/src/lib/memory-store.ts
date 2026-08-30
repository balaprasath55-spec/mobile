/**
 * In-memory fallback when MongoDB is unreachable (e.g. DNS/SRV issues on Windows).
 */
import { buildCatalogSeed } from "@/lib/db/catalog-seed";
import type {
  DemoBrand,
  DemoCustomer,
  DemoEnquiry,
  DemoEnquiryStatus,
  DemoEstimate,
  DemoIssue,
  DemoModel,
  DemoRepair,
  DemoRepairStatus,
} from "@/lib/demo-store";
import { buildShopRecords } from "@/lib/shop-data";
import { bestSequentialRank, compareAlphabetic } from "@/lib/search-utils";

type Store = {
  customers: DemoCustomer[];
  repairs: DemoRepair[];
  enquiries: DemoEnquiry[];
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
};

const globalMem = globalThis as unknown as { __mrMemStore?: Store };

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function seed(): Store {
  const { brands, models, issues, estimates } = buildCatalogSeed();
  const { customers, repairs, jobSeq } = buildShopRecords();
  return {
    customers,
    repairs,
    enquiries: [],
    brands,
    models,
    issues,
    estimates,
    courseNotifies: [],
    auditLogs: [],
    jobSeq,
  };
}

function getStore(): Store {
  if (!globalMem.__mrMemStore) globalMem.__mrMemStore = seed();
  return globalMem.__mrMemStore;
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
  return getStore().customers.find((c) => c.id === id) ?? null;
}

export async function findCustomerByPhone(phone: string) {
  return getStore().customers.find((c) => c.phone === phone) ?? null;
}

export async function countCustomers() {
  return getStore().customers.length;
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
  let rows = [...s.customers];

  if (qLower) {
    rows = rows.filter((c) => {
      const repairs = s.repairs.filter((r) => r.customerId === c.id);
      return (
        c.name.toLowerCase().includes(qLower) ||
        c.phone.includes(qLower) ||
        (c.location ?? "").toLowerCase().includes(qLower) ||
        repairs.some((r) => r.jobId.toLowerCase().includes(qLower) || (r.imei ?? "").includes(qLower))
      );
    });
    rows.sort((a, b) => {
      const repairsA = s.repairs.filter((r) => r.customerId === a.id);
      const repairsB = s.repairs.filter((r) => r.customerId === b.id);
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
    .repairs.filter((r) => r.customerId === customerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createCustomer(data: Omit<DemoCustomer, "id" | "createdAt">) {
  const customer: DemoCustomer = { ...data, id: newId("cust"), createdAt: new Date() };
  getStore().customers.unshift(customer);
  return customer;
}

export async function updateCustomer(customerId: string, data: Partial<DemoCustomer>) {
  const s = getStore();
  const idx = s.customers.findIndex((c) => c.id === customerId);
  if (idx < 0) return null;
  s.customers[idx] = { ...s.customers[idx], ...data, id: customerId };
  return s.customers[idx];
}

export async function deleteCustomer(customerId: string, cascade = false) {
  const s = getStore();
  if (!s.customers.some((c) => c.id === customerId)) return false;
  if (!cascade && s.repairs.some((r) => r.customerId === customerId)) return false;
  if (cascade) {
    s.repairs = s.repairs.filter((r) => r.customerId !== customerId);
  }
  s.customers = s.customers.filter((c) => c.id !== customerId);
  return true;
}

export async function deleteRepair(repairId: string) {
  const s = getStore();
  const before = s.repairs.length;
  s.repairs = s.repairs.filter((r) => r.id !== repairId);
  return s.repairs.length < before;
}

export async function getRepairById(id: string) {
  return getStore().repairs.find((r) => r.id === id) ?? null;
}

export async function countRepairs(filter?: { status?: DemoRepairStatus | DemoRepairStatus[] }) {
  let rows = getStore().repairs;
  if (filter?.status) {
    const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
    rows = rows.filter((r) => statuses.includes(r.status));
  }
  return rows.length;
}

export async function getRecentRepairs(limit: number) {
  return [...getStore().repairs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
}

export async function queryRepairs(opts: {
  q?: string;
  status?: DemoRepairStatus;
  customerId?: string;
  page: number;
  pageSize: number;
}) {
  const s = getStore();
  const qLower = opts.q?.trim().toLowerCase() ?? "";
  let rows = [...s.repairs];
  if (opts.status) rows = rows.filter((r) => r.status === opts.status);
  if (opts.customerId) rows = rows.filter((r) => r.customerId === opts.customerId);
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

  const customerMap = new Map(s.customers.map((c) => [c.id, c]));
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
  data: Omit<DemoRepair, "id" | "jobId" | "createdAt" | "status" | "deliveredAt" | "imageUrl"> & {
    status?: DemoRepairStatus;
    imageUrl?: string | null;
  }
) {
  const repair: DemoRepair = {
    ...data,
    id: newId("rep"),
    jobId: await nextJobId(),
    status: data.status ?? "RECEIVED",
    deliveredAt: null,
    imageUrl: data.imageUrl ?? null,
    createdAt: new Date(),
  };
  getStore().repairs.unshift(repair);
  return repair;
}

export async function updateRepair(repairId: string, data: Partial<DemoRepair>) {
  const s = getStore();
  const idx = s.repairs.findIndex((r) => r.id === repairId);
  if (idx < 0) return null;
  s.repairs[idx] = { ...s.repairs[idx], ...data, id: repairId, jobId: s.repairs[idx].jobId };
  return s.repairs[idx];
}

export async function listEnquiries(status?: DemoEnquiryStatus) {
  let rows = getStore().enquiries.filter((e) => !status || e.status === status);
  rows = [...rows].sort((a, b) => compareAlphabetic(a.name, b.name));
  return rows;
}

export async function countEnquiries(status?: DemoEnquiryStatus) {
  return getStore().enquiries.filter((e) => !status || e.status === status).length;
}

export async function getEnquiryById(id: string) {
  return getStore().enquiries.find((e) => e.id === id) ?? null;
}

export async function createEnquiry(
  data: Omit<DemoEnquiry, "id" | "createdAt" | "status"> & { status?: DemoEnquiryStatus }
) {
  const enquiry: DemoEnquiry = {
    ...data,
    id: newId("enq"),
    status: data.status ?? "NEW",
    createdAt: new Date(),
  };
  getStore().enquiries.unshift(enquiry);
  return enquiry;
}

export async function updateEnquiryStatus(id: string, status: DemoEnquiryStatus) {
  const s = getStore();
  const enquiry = s.enquiries.find((e) => e.id === id);
  if (!enquiry) return null;
  enquiry.status = status;
  return enquiry;
}

export async function deleteEnquiry(enquiryId: string) {
  const s = getStore();
  const before = s.enquiries.length;
  s.enquiries = s.enquiries.filter((e) => e.id !== enquiryId);
  return s.enquiries.length < before;
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
  return getStore().repairs.length;
}

export function isMemoryBackend() {
  return Boolean(globalMem.__mrMemStore);
}
