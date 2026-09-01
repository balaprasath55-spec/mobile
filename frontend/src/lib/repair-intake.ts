import { z } from "zod";

/** Device intake checklist captured when creating/editing a repair job. */
export const repairIntakeChecksSchema = z.object({
  faceIdWorking: z.boolean().default(false),
  frameBend: z.boolean().default(false),
  displayBlank: z.boolean().default(false),
  simTray: z.boolean().default(false),
  sPen: z.boolean().default(false),
  mobileCourierFromShop: z.boolean().default(false),
  foldAndFlip: z.boolean().default(false),
  innerDisplayOk: z.boolean().default(false),
  outerDisplayOk: z.boolean().default(false),
  pendingAlert3Days: z.boolean().default(false),
  paymentCash: z.boolean().default(false),
  paymentGpay: z.boolean().default(false),
  deliveryCourier: z.boolean().default(false),
  deliveryHand: z.boolean().default(false),
});

export type RepairIntakeChecks = z.infer<typeof repairIntakeChecksSchema>;

export const DEFAULT_REPAIR_INTAKE: RepairIntakeChecks = {
  faceIdWorking: false,
  frameBend: false,
  displayBlank: false,
  simTray: false,
  sPen: false,
  mobileCourierFromShop: false,
  foldAndFlip: false,
  innerDisplayOk: false,
  outerDisplayOk: false,
  pendingAlert3Days: false,
  paymentCash: false,
  paymentGpay: false,
  deliveryCourier: false,
  deliveryHand: false,
};

export function normalizeRepairIntakeChecks(
  raw?: Partial<RepairIntakeChecks> | null
): RepairIntakeChecks {
  const parsed = repairIntakeChecksSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : DEFAULT_REPAIR_INTAKE;
}

export const INTAKE_TOGGLE_LABELS: { key: keyof RepairIntakeChecks; label: string }[] = [
  { key: "faceIdWorking", label: "Face ID working" },
  { key: "frameBend", label: "Frame bend" },
  { key: "displayBlank", label: "Display blank" },
  { key: "simTray", label: "Sim tray" },
  { key: "sPen", label: "S-pen" },
  { key: "mobileCourierFromShop", label: "Mobile courier from shop (dealer)" },
  { key: "foldAndFlip", label: "Fold / flip device" },
  { key: "innerDisplayOk", label: "Inner display condition" },
  { key: "outerDisplayOk", label: "Outer display condition" },
  { key: "pendingAlert3Days", label: "Pending mobiles alert once in 3 days" },
  { key: "paymentCash", label: "Cash" },
  { key: "paymentGpay", label: "GPay" },
  { key: "deliveryCourier", label: "Courier delivery" },
  { key: "deliveryHand", label: "Hand delivery" },
];

export function formatIntakeSummary(checks: RepairIntakeChecks): string[] {
  return INTAKE_TOGGLE_LABELS.filter(({ key }) => checks[key]).map(({ label }) => label);
}
