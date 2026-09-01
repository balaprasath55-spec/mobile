import type { DemoRepairStatus } from "@/lib/demo-store";

export const REPAIR_STATUS_LABELS: Record<DemoRepairStatus, string> = {
  RECEIVED: "Received",
  IN_REPAIR: "In repair",
  DELIVERED: "Delivered",
};

export const REPAIR_STATUS_FLOW: DemoRepairStatus[] = ["RECEIVED", "IN_REPAIR", "DELIVERED"];

/** Map legacy statuses from older records to the simplified flow. */
const LEGACY_STATUS_MAP: Record<string, DemoRepairStatus> = {
  DIAGNOSED: "IN_REPAIR",
  QUALITY_CHECK: "IN_REPAIR",
  READY_FOR_DELIVERY: "IN_REPAIR",
  CLOSED: "DELIVERED",
};

export function normalizeRepairStatus(status: string): DemoRepairStatus {
  if (status === "RECEIVED" || status === "IN_REPAIR" || status === "DELIVERED") return status;
  return LEGACY_STATUS_MAP[status] ?? "RECEIVED";
}

export function repairStatusLabel(status: string) {
  return REPAIR_STATUS_LABELS[normalizeRepairStatus(status)];
}

export function emptyToNull(v?: string | null) {
  if (v == null || v === "") return null;
  return v;
}
