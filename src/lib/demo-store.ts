/**
 * In-memory demo data store — no database required.
 * Resets when the Node process restarts.
 */

export type DemoRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";
export type DemoRepairStatus =
  | "RECEIVED"
  | "DIAGNOSED"
  | "IN_REPAIR"
  | "QUALITY_CHECK"
  | "READY_FOR_DELIVERY"
  | "DELIVERED"
  | "CLOSED";
export type DemoEnquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

export type DemoCustomer = {
  id: string;
  name: string;
  phone: string;
  altPhone: string | null;
  address: string | null;
  location: string | null;
  createdAt: Date;
};

export type DemoRepair = {
  id: string;
  jobId: string;
  customerId: string;
  modelId: string | null;
  deviceBrandRaw: string | null;
  deviceModelRaw: string | null;
  imei: string | null;
  issue: string;
  status: DemoRepairStatus;
  technicianId: string | null;
  amount: number | null;
  advancePaid: number;
  warrantyDays: number | null;
  deliveryDate: Date | null;
  deliveredAt: Date | null;
  notes: string | null;
  imageUrl: string | null;
  createdAt: Date;
};

export type DemoEnquiry = {
  id: string;
  name: string;
  phone: string;
  device: string | null;
  issue: string | null;
  location: string | null;
  message: string | null;
  imageUrl: string | null;
  status: DemoEnquiryStatus;
  createdAt: Date;
};

export type DemoBrand = { id: string; name: string; isActive: boolean };
export type DemoModel = { id: string; brandId: string; name: string; isActive: boolean };
export type DemoIssue = { id: string; name: string; isActive: boolean };
export type DemoEstimate = {
  id: string;
  modelId: string;
  issueId: string;
  priceMin: number;
  priceMax: number;
  isActive: boolean;
};

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

const globalForDemo = globalThis as unknown as { __mrDemoStore?: Store };

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function seed(): Store {
  const brands: DemoBrand[] = [
    { id: "brand_apple", name: "Apple", isActive: true },
    { id: "brand_samsung", name: "Samsung", isActive: true },
    { id: "brand_xiaomi", name: "Xiaomi", isActive: true },
    { id: "brand_redmi", name: "Redmi", isActive: true },
    { id: "brand_poco", name: "POCO", isActive: true },
    { id: "brand_oneplus", name: "OnePlus", isActive: true },
    { id: "brand_vivo", name: "Vivo", isActive: true },
    { id: "brand_oppo", name: "Oppo", isActive: true },
    { id: "brand_realme", name: "Realme", isActive: true },
    { id: "brand_motorola", name: "Motorola", isActive: true },
    { id: "brand_google", name: "Google", isActive: true },
    { id: "brand_nothing", name: "Nothing", isActive: true },
    { id: "brand_iqoo", name: "iQOO", isActive: true },
    { id: "brand_honor", name: "Honor", isActive: true },
    { id: "brand_huawei", name: "Huawei", isActive: true },
    { id: "brand_nokia", name: "Nokia", isActive: true },
    { id: "brand_asus", name: "Asus", isActive: true },
    { id: "brand_infinix", name: "Infinix", isActive: true },
    { id: "brand_tecno", name: "Tecno", isActive: true },
    { id: "brand_lava", name: "Lava", isActive: true },
  ];

  const modelSeed: Record<string, string[]> = {
    brand_apple: [
      "iPhone 11",
      "iPhone 12",
      "iPhone 12 Pro",
      "iPhone 13",
      "iPhone 13 Pro",
      "iPhone 14",
      "iPhone 14 Pro",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 16",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      "iPhone SE (3rd gen)",
      "iPad Air",
      "iPad Pro 11",
      "iPad mini",
    ],
    brand_samsung: [
      "Galaxy S21",
      "Galaxy S22",
      "Galaxy S23",
      "Galaxy S23 Ultra",
      "Galaxy S24",
      "Galaxy S24 Ultra",
      "Galaxy S25",
      "Galaxy A14",
      "Galaxy A34",
      "Galaxy A54",
      "Galaxy A55",
      "Galaxy M34",
      "Galaxy Z Flip5",
      "Galaxy Z Flip6",
      "Galaxy Z Fold5",
      "Galaxy Z Fold6",
      "Galaxy Note 20",
      "Galaxy Tab S9",
    ],
    brand_xiaomi: ["Xiaomi 12", "Xiaomi 13", "Xiaomi 14", "Xiaomi 14 Ultra", "Xiaomi 15", "Mix Fold 3"],
    brand_redmi: [
      "Redmi Note 11",
      "Redmi Note 12",
      "Redmi Note 13",
      "Redmi Note 13 Pro",
      "Redmi Note 14",
      "Redmi 12",
      "Redmi 13C",
      "Redmi K70",
    ],
    brand_poco: ["POCO F5", "POCO F6", "POCO X5 Pro", "POCO X6", "POCO M6 Pro", "POCO C65"],
    brand_oneplus: [
      "OnePlus 10 Pro",
      "OnePlus 11",
      "OnePlus 12",
      "OnePlus 12R",
      "OnePlus 13",
      "OnePlus Nord CE 3",
      "OnePlus Nord 3",
      "OnePlus Nord 4",
      "OnePlus Open",
    ],
    brand_vivo: [
      "Vivo V27",
      "Vivo V29",
      "Vivo V30",
      "Vivo V40",
      "Vivo X100",
      "Vivo X100 Pro",
      "Vivo Y100",
      "Vivo Y200",
      "Vivo T3",
      "Vivo X Fold 3",
      "Vivo X Fold 3 Pro",
    ],
    brand_oppo: [
      "Oppo A78",
      "Oppo A59",
      "Oppo Reno 10",
      "Oppo Reno 11",
      "Oppo Reno 12",
      "Oppo Find X5",
      "Oppo Find X6",
      "Oppo Find N3",
      "Oppo F25",
    ],
    brand_realme: [
      "Realme 11",
      "Realme 12",
      "Realme 12 Pro",
      "Realme GT 5",
      "Realme GT 6",
      "Realme Narzo 60",
      "Realme Narzo 70",
      "Realme C67",
      "Realme C75",
    ],
    brand_motorola: [
      "Moto G84",
      "Moto G54",
      "Moto G73",
      "Moto Edge 40",
      "Moto Edge 50",
      "Moto Edge 50 Pro",
      "Moto Edge 60 Fusion",
      "Razr 40",
      "Razr 50",
    ],
    brand_google: ["Pixel 6a", "Pixel 7", "Pixel 7a", "Pixel 8", "Pixel 8 Pro", "Pixel 8a", "Pixel 9", "Pixel 9 Pro"],
    brand_nothing: ["Nothing Phone (1)", "Nothing Phone (2)", "Nothing Phone (2a)", "Nothing Phone (3a)"],
    brand_iqoo: ["iQOO Z7", "iQOO Z9", "iQOO Neo 7", "iQOO Neo 9", "iQOO 12", "iQOO 13"],
    brand_honor: ["Honor 90", "Honor 200", "Honor X9b", "Honor Magic 6", "Honor Magic V2"],
    brand_huawei: ["Huawei P30", "Huawei P40", "Huawei Mate 40", "Huawei Nova 11", "Huawei Mate X3"],
    brand_nokia: ["Nokia G42", "Nokia G22", "Nokia X30", "Nokia C32"],
    brand_asus: ["ROG Phone 7", "ROG Phone 8", "Zenfone 10", "Zenfone 11"],
    brand_infinix: ["Infinix Hot 40", "Infinix Note 40", "Infinix Zero 30", "Infinix GT 20"],
    brand_tecno: ["Tecno Spark 20", "Tecno Camon 30", "Tecno Pova 5", "Tecno Phantom V"],
    brand_lava: ["Lava Blaze 2", "Lava Agni 2", "Lava Yuva 3", "Lava Storm"],
  };

  const models: DemoModel[] = [];
  for (const [brandId, names] of Object.entries(modelSeed)) {
    names.forEach((name, i) => {
      models.push({ id: `model_${brandId}_${i}`, brandId, name, isActive: true });
    });
  }

  const issues: DemoIssue[] = [
    "Display",
    "Battery",
    "Back Glass",
    "Touch Glass",
    "Face ID",
    "Motherboard/Water Damage",
  ].map((name, i) => ({ id: `issue_${i}`, name, isActive: true }));

  const ranges: Record<string, { min: number; max: number }> = {
    Display: { min: 2500, max: 28000 },
    Battery: { min: 1200, max: 6500 },
    "Back Glass": { min: 1800, max: 12000 },
    "Touch Glass": { min: 1500, max: 9000 },
    "Face ID": { min: 4500, max: 18000 },
    "Motherboard/Water Damage": { min: 3500, max: 25000 },
  };

  const estimates: DemoEstimate[] = [];
  for (const model of models) {
    const brand = brands.find((b) => b.id === model.brandId)!;
    const premium = brand.name === "Apple" ? 1.4 : brand.name === "Samsung" ? 1.15 : 1;
    for (const issue of issues) {
      const range = ranges[issue.name];
      estimates.push({
        id: `est_${model.id}_${issue.id}`,
        modelId: model.id,
        issueId: issue.id,
        priceMin: Math.round(range.min * premium),
        priceMax: Math.round(range.max * premium),
        isActive: true,
      });
    }
  }

  const customers: DemoCustomer[] = [
    {
      id: "cust_arun",
      name: "Arun Kumar",
      phone: "9876543210",
      altPhone: null,
      address: "12 Anna Salai",
      location: "T. Nagar",
      createdAt: new Date("2026-06-01"),
    },
    {
      id: "cust_priya",
      name: "Priya S",
      phone: "9988776655",
      altPhone: "9000011122",
      address: null,
      location: "Adyar",
      createdAt: new Date("2026-06-15"),
    },
    {
      id: "cust_vikram",
      name: "Vikram M",
      phone: "9123456780",
      altPhone: null,
      address: "Courier · Coimbatore",
      location: "Coimbatore",
      createdAt: new Date("2026-07-01"),
    },
  ];

  const repairs: DemoRepair[] = [
    {
      id: "rep_1",
      jobId: "MRZ-000001",
      customerId: "cust_arun",
      modelId: "model_brand_apple_2",
      deviceBrandRaw: "Apple",
      deviceModelRaw: "iPhone 15",
      imei: "356938035643809",
      issue: "Display cracked",
      status: "IN_REPAIR",
      technicianId: null,
      amount: 18500,
      advancePaid: 5000,
      warrantyDays: 90,
      deliveryDate: null,
      deliveredAt: null,
      notes: "OEM-grade panel",
      imageUrl: null,
      createdAt: new Date(),
    },
    {
      id: "rep_2",
      jobId: "MRZ-000002",
      customerId: "cust_priya",
      modelId: null,
      deviceBrandRaw: "Samsung",
      deviceModelRaw: "Galaxy S24",
      imei: null,
      issue: "Battery replacement",
      status: "READY_FOR_DELIVERY",
      technicianId: null,
      amount: 3200,
      advancePaid: 1000,
      warrantyDays: 180,
      deliveryDate: null,
      deliveredAt: null,
      notes: null,
      imageUrl: null,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "rep_3",
      jobId: "MRZ-000003",
      customerId: "cust_vikram",
      modelId: null,
      deviceBrandRaw: "Apple",
      deviceModelRaw: "iPhone 13",
      imei: null,
      issue: "Water damage recovery",
      status: "DELIVERED",
      technicianId: null,
      amount: 9500,
      advancePaid: 3000,
      warrantyDays: 30,
      deliveryDate: null,
      deliveredAt: new Date(Date.now() - 3600000),
      notes: "Courier return shipped",
      imageUrl: null,
      createdAt: new Date(Date.now() - 3 * 86400000),
    },
  ];

  const enquiries: DemoEnquiry[] = [
    {
      id: "enq_1",
      name: "Karthik R",
      phone: "9012345678",
      device: "iPhone 14",
      issue: "Back glass",
      location: "Velachery",
      message: "Need same-day if possible",
      imageUrl: null,
      status: "NEW",
      createdAt: new Date(),
    },
    {
      id: "enq_2",
      name: "Meena L",
      phone: "9090909090",
      device: "OnePlus 12",
      issue: "Charging port",
      location: "Anna Nagar",
      message: null,
      imageUrl: null,
      status: "CONTACTED",
      createdAt: new Date(Date.now() - 86400000),
    },
  ];

  return {
    customers,
    repairs,
    enquiries,
    brands,
    models,
    issues,
    estimates,
    courseNotifies: [],
    auditLogs: [],
    jobSeq: 4,
  };
}

export function getStore(): Store {
  if (!globalForDemo.__mrDemoStore) {
    globalForDemo.__mrDemoStore = seed();
  }
  return globalForDemo.__mrDemoStore;
}

export const DEMO_ADMIN = {
  id: "admin_demo",
  name: "Super Admin",
  email: "admin@mrmobilezone.com",
  password: "Admin@12345",
  role: "SUPER_ADMIN" as DemoRole,
};

export function nextJobId() {
  const store = getStore();
  const jobId = `MRZ-${String(store.jobSeq).padStart(6, "0")}`;
  store.jobSeq += 1;
  return jobId;
}

export function writeAudit(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: unknown;
}) {
  const store = getStore();
  store.auditLogs.unshift({
    id: id("audit"),
    ...input,
    timestamp: new Date(),
  });
}

export function createCustomer(data: Omit<DemoCustomer, "id" | "createdAt">) {
  const store = getStore();
  const customer: DemoCustomer = { ...data, id: id("cust"), createdAt: new Date() };
  store.customers.unshift(customer);
  return customer;
}

export function updateCustomer(customerId: string, data: Partial<DemoCustomer>) {
  const store = getStore();
  const idx = store.customers.findIndex((c) => c.id === customerId);
  if (idx < 0) return null;
  store.customers[idx] = { ...store.customers[idx], ...data, id: customerId };
  return store.customers[idx];
}

export function deleteCustomer(customerId: string) {
  const store = getStore();
  if (store.repairs.some((r) => r.customerId === customerId)) return false;
  store.customers = store.customers.filter((c) => c.id !== customerId);
  return true;
}

export function createRepair(
  data: Omit<DemoRepair, "id" | "jobId" | "createdAt" | "status" | "deliveredAt" | "imageUrl"> & {
    status?: DemoRepairStatus;
    imageUrl?: string | null;
  }
) {
  const store = getStore();
  const repair: DemoRepair = {
    ...data,
    id: id("rep"),
    jobId: nextJobId(),
    status: data.status ?? "RECEIVED",
    deliveredAt: null,
    imageUrl: data.imageUrl ?? null,
    createdAt: new Date(),
  };
  store.repairs.unshift(repair);
  return repair;
}

export function updateRepair(repairId: string, data: Partial<DemoRepair>) {
  const store = getStore();
  const idx = store.repairs.findIndex((r) => r.id === repairId);
  if (idx < 0) return null;
  store.repairs[idx] = { ...store.repairs[idx], ...data, id: repairId, jobId: store.repairs[idx].jobId };
  return store.repairs[idx];
}

export function createEnquiry(data: Omit<DemoEnquiry, "id" | "createdAt" | "status"> & { status?: DemoEnquiryStatus }) {
  const store = getStore();
  const enquiry: DemoEnquiry = {
    ...data,
    id: id("enq"),
    status: data.status ?? "NEW",
    createdAt: new Date(),
  };
  store.enquiries.unshift(enquiry);
  return enquiry;
}

export function getBrandName(brandId: string) {
  return getStore().brands.find((b) => b.id === brandId)?.name;
}

export function getModelWithBrand(modelId: string | null) {
  if (!modelId) return null;
  const store = getStore();
  const model = store.models.find((m) => m.id === modelId);
  if (!model) return null;
  const brand = store.brands.find((b) => b.id === model.brandId);
  return { ...model, brand: brand! };
}
