import { z } from "zod";
import { repairIntakeChecksSchema, DEFAULT_REPAIR_INTAKE } from "@/lib/repair-intake";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone"),
  issue: z.string().min(2, "Issue is required"),
  imageUrl: z.string().min(1, "Photo is required"),
  device: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export const courseNotifySchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(5),
});

export const estimateQuerySchema = z.object({
  modelId: z.string().min(1),
  issueId: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone is required").max(15),
  altPhone: z.string().max(15).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
});

export const repairSchema = z.object({
  customerId: z.string().min(1),
  modelId: z.string().optional().or(z.literal("")),
  deviceBrandRaw: z.string().optional().or(z.literal("")),
  deviceModelRaw: z.string().optional().or(z.literal("")),
  imei: z.string().optional().or(z.literal("")),
  issue: z.string().min(2, "Issue is required"),
  technicianId: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().nonnegative().optional().nullable(),
  advancePaid: z.coerce.number().nonnegative().optional().default(0),
  notes: z.string().max(2000).optional().or(z.literal("")),
  deliveryDate: z.string().optional().or(z.literal("")),
  intakeChecks: repairIntakeChecksSchema.optional().default(DEFAULT_REPAIR_INTAKE),
});

export const repairStatusSchema = z.object({
  status: z.enum(["RECEIVED", "IN_REPAIR", "DELIVERED"]),
});

export const dealerSchema = z.object({
  name: z.string().min(2, "Contact name is required"),
  shopName: z.string().min(2, "Shop name is required"),
  phone: z.string().min(10, "Phone is required").max(15),
  location: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const dealerBatchDeviceSchema = z.object({
  deviceBrandRaw: z.string().max(100).optional().or(z.literal("")),
  deviceModelRaw: z.string().min(1, "Model is required"),
  modelId: z.string().optional().or(z.literal("")),
  issue: z.string().min(2, "Issue is required"),
  imei: z.string().max(20).optional().or(z.literal("")),
  intakeChecks: repairIntakeChecksSchema.optional().default(DEFAULT_REPAIR_INTAKE),
});

export const dealerBatchSchema = z.object({
  notes: z.string().max(2000).optional().or(z.literal("")),
  devices: z.array(dealerBatchDeviceSchema).min(1, "Add at least one device").max(20),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONVERTED", "CLOSED"]),
});

const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"]);

export const attendanceBulkSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  records: z
    .array(
      z.object({
        employeeId: z.string().min(1),
        status: attendanceStatusEnum,
        notes: z.string().max(500).optional().nullable(),
      })
    )
    .min(1),
});

export const attendanceExportQuerySchema = z
  .object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD for from"),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD for to"),
  })
  .refine((v) => v.from <= v.to, { message: "From date must be on or before to date" });

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type CourseNotifyInput = z.infer<typeof courseNotifySchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type RepairInput = z.infer<typeof repairSchema>;
