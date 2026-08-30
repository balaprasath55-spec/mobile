/**
 * Shared domain types for MR Mobile Zone.
 * Data access: Express backend API (NEXT_PUBLIC_API_URL).
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

export const DEMO_ADMIN = {
  id: "admin_demo",
  name: "Super Admin",
  email: "admin@mrmobilezone.com",
  password: "Admin@12345",
  role: "SUPER_ADMIN" as DemoRole,
};
