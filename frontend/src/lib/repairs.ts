import type { DemoRepairStatus } from "@/lib/demo-store";

export const REPAIR_STATUS_LABELS: Record<DemoRepairStatus, string> = {
  RECEIVED: "Received",
  DIAGNOSED: "Diagnosed",
  IN_REPAIR: "In repair",
  QUALITY_CHECK: "Quality check",
  READY_FOR_DELIVERY: "Ready for delivery",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
};

export const REPAIR_STATUS_FLOW: DemoRepairStatus[] = [
  "RECEIVED",
  "DIAGNOSED",
  "IN_REPAIR",
  "QUALITY_CHECK",
  "READY_FOR_DELIVERY",
  "DELIVERED",
  "CLOSED",
];

export function emptyToNull(v?: string | null) {
  if (v == null || v === "") return null;
  return v;
}
