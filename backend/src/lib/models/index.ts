import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { repairIntakeChecksFields } from "@/lib/repair-intake";

/** Soft-delete + audit timestamps shared by CRM collections. */
const softDeleteFields = {
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date, required: true },
};

const customerSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    altPhone: { type: String, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    createdAt: { type: Date, required: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const repairSchema = new Schema(
  {
    _id: { type: String, required: true },
    jobId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    source: { type: String, default: "WALK_IN", index: true },
    dealerId: { type: String, default: null, index: true },
    batchId: { type: String, default: null, index: true },
    modelId: { type: String, default: null },
    deviceBrandRaw: { type: String, default: null },
    deviceModelRaw: { type: String, default: null },
    imei: { type: String, default: null, index: true },
    issue: { type: String, required: true },
    status: { type: String, required: true, index: true },
    technicianId: { type: String, default: null },
    amount: { type: Number, default: null },
    advancePaid: { type: Number, default: 0 },
    deliveryDate: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    notes: { type: String, default: null },
    imageUrl: { type: String, default: null },
    intakeChecks: {
      type: new Schema(repairIntakeChecksFields, { _id: false }),
      default: () => ({}),
    },
    createdAt: { type: Date, required: true, index: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const enquirySchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    device: { type: String, default: null },
    issue: { type: String, default: null },
    location: { type: String, default: null },
    message: { type: String, default: null },
    imageUrl: { type: String, default: null },
    status: { type: String, required: true, index: true },
    createdAt: { type: Date, required: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const dealerSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    shopName: { type: String, required: true, index: true },
    phone: { type: String, required: true, index: true },
    location: { type: String, default: null },
    notes: { type: String, default: null },
    customerId: { type: String, required: true, index: true },
    createdAt: { type: Date, required: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const dealerBatchSchema = new Schema(
  {
    _id: { type: String, required: true },
    dealerId: { type: String, required: true, index: true },
    batchRef: { type: String, required: true, unique: true, index: true },
    notes: { type: String, default: null },
    deviceCount: { type: Number, required: true },
    createdAt: { type: Date, required: true, index: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const brandSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

const modelSchema = new Schema(
  {
    _id: { type: String, required: true },
    brandId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

const issueSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

const estimateSchema = new Schema(
  {
    _id: { type: String, required: true },
    modelId: { type: String, required: true, index: true },
    issueId: { type: String, required: true, index: true },
    priceMin: { type: Number, required: true },
    priceMax: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

const auditLogSchema = new Schema(
  {
    _id: { type: String, required: true },
    adminUserId: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    changes: { type: Schema.Types.Mixed, default: null },
    timestamp: { type: Date, required: true, index: true },
  },
  { versionKey: false }
);

const courseNotifySchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

const counterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  { versionKey: false }
);

const employeeSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, required: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

const attendanceSchema = new Schema(
  {
    _id: { type: String, required: true },
    employeeId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    status: { type: String, required: true },
    notes: { type: String, default: null },
    createdAt: { type: Date, required: true },
    ...softDeleteFields,
  },
  { versionKey: false }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export type CustomerDoc = InferSchemaType<typeof customerSchema> & { _id: string };
export type RepairDoc = InferSchemaType<typeof repairSchema> & { _id: string };
export type EnquiryDoc = InferSchemaType<typeof enquirySchema> & { _id: string };
export type EmployeeDoc = InferSchemaType<typeof employeeSchema> & { _id: string };
export type AttendanceDoc = InferSchemaType<typeof attendanceSchema> & { _id: string };

for (const name of [
  "Customer",
  "Repair",
  "Enquiry",
  "CourseNotify",
  "Brand",
  "DeviceModel",
  "Issue",
  "Estimate",
  "Dealer",
  "DealerBatch",
  "Employee",
  "Attendance",
]) {
  if (mongoose.models[name]) delete mongoose.models[name];
}

export const Customer = mongoose.model("Customer", customerSchema, "customers");
export const Repair = mongoose.model("Repair", repairSchema, "repairs");
export const Enquiry = mongoose.model("Enquiry", enquirySchema, "enquiries");
export const Dealer = mongoose.model("Dealer", dealerSchema, "dealers");
export const DealerBatch = mongoose.model("DealerBatch", dealerBatchSchema, "dealer_batches");
export const Brand = mongoose.model("Brand", brandSchema, "brands");
export const DeviceModel = mongoose.model("DeviceModel", modelSchema, "models");
export const Issue = mongoose.model("Issue", issueSchema, "issues");
export const Estimate = mongoose.model("Estimate", estimateSchema, "estimates");
export const AuditLog =
  mongoose.models.AuditLog ?? mongoose.model("AuditLog", auditLogSchema, "audit_logs");
export const CourseNotify = mongoose.model("CourseNotify", courseNotifySchema, "course_notifies");
export const Counter =
  mongoose.models.Counter ?? mongoose.model("Counter", counterSchema, "counters");
export const Employee = mongoose.model("Employee", employeeSchema, "employees");
export const Attendance = mongoose.model("Attendance", attendanceSchema, "attendance");
