/**
 * Shared domain types for MR Mobile Zone.
 * Data access: Express backend API (NEXT_PUBLIC_API_URL).
 */

export type DemoRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";
export type DemoRepairStatus = "RECEIVED" | "IN_REPAIR" | "DELIVERED";
export type DemoRepairSource = "WALK_IN" | "DEALER";
export type DemoEnquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

export type RepairIntakeChecks = {
  faceIdWorking: boolean;
  frameBend: boolean;
  displayBlank: boolean;
  simTray: boolean;
  sPen: boolean;
  mobileCourierFromShop: boolean;
  foldAndFlip: boolean;
  innerDisplayOk: boolean;
  outerDisplayOk: boolean;
  pendingAlert3Days: boolean;
  paymentCash: boolean;
  paymentGpay: boolean;
  deliveryCourier: boolean;
  deliveryHand: boolean;
};

export type DemoAttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";

/** Soft-delete + update audit fields on CRM records. */
export type SoftDeleteFields = {
  isDeleted: boolean;
  deletedAt: Date | null;
  updatedAt: Date;
};

export type DemoCustomer = {
  id: string;
  name: string;
  phone: string;
  altPhone: string | null;
  address: string | null;
  location: string | null;
  createdAt: Date;
} & SoftDeleteFields;

export type DemoRepair = {
  id: string;
  jobId: string;
  customerId: string;
  source: DemoRepairSource;
  dealerId: string | null;
  batchId: string | null;
  modelId: string | null;
  deviceBrandRaw: string | null;
  deviceModelRaw: string | null;
  imei: string | null;
  issue: string;
  status: DemoRepairStatus;
  technicianId: string | null;
  amount: number | null;
  advancePaid: number;
  deliveryDate: Date | null;
  deliveredAt: Date | null;
  notes: string | null;
  imageUrl: string | null;
  intakeChecks: RepairIntakeChecks;
  createdAt: Date;
} & SoftDeleteFields;

export type DemoDealer = {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  location: string | null;
  notes: string | null;
  customerId: string;
  createdAt: Date;
} & SoftDeleteFields;

export type DemoDealerBatch = {
  id: string;
  dealerId: string;
  batchRef: string;
  notes: string | null;
  deviceCount: number;
  createdAt: Date;
} & SoftDeleteFields;

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
} & SoftDeleteFields;

export type DemoEmployee = {
  id: string;
  name: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
};

export type DemoAttendance = {
  id: string;
  employeeId: string;
  date: string;
  status: DemoAttendanceStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
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

export const DEMO_ADMIN = {
  id: "admin_demo",
  name: "Super Admin",
  email: "admin@mrmobilezone.com",
  password: "Admin@12345",
  role: "SUPER_ADMIN" as DemoRole,
};
