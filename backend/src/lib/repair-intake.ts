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

/** Mongo sub-document field definitions. */
export const repairIntakeChecksFields = {
  faceIdWorking: { type: Boolean, default: false },
  frameBend: { type: Boolean, default: false },
  displayBlank: { type: Boolean, default: false },
  simTray: { type: Boolean, default: false },
  sPen: { type: Boolean, default: false },
  mobileCourierFromShop: { type: Boolean, default: false },
  foldAndFlip: { type: Boolean, default: false },
  innerDisplayOk: { type: Boolean, default: false },
  outerDisplayOk: { type: Boolean, default: false },
  pendingAlert3Days: { type: Boolean, default: false },
  paymentCash: { type: Boolean, default: false },
  paymentGpay: { type: Boolean, default: false },
  deliveryCourier: { type: Boolean, default: false },
  deliveryHand: { type: Boolean, default: false },
} as const;
