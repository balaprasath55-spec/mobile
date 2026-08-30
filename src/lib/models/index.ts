import mongoose, { Schema, type InferSchemaType } from "mongoose";

const customerSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    altPhone: { type: String, default: null },
    address: { type: String, default: null },
    location: { type: String, default: null },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false }
);

const repairSchema = new Schema(
  {
    _id: { type: String, required: true },
    jobId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
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
    createdAt: { type: Date, required: true, index: true },
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
  },
  { versionKey: false }
);

const brandSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false }
);

const modelSchema = new Schema(
  {
    _id: { type: String, required: true },
    brandId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false }
);

const issueSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
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

export type CustomerDoc = InferSchemaType<typeof customerSchema>;
export type RepairDoc = InferSchemaType<typeof repairSchema>;

export const Customer =
  mongoose.models.Customer ?? mongoose.model("Customer", customerSchema, "customers");
export const Repair = mongoose.models.Repair ?? mongoose.model("Repair", repairSchema, "repairs");
export const Enquiry =
  mongoose.models.Enquiry ?? mongoose.model("Enquiry", enquirySchema, "enquiries");
export const Brand = mongoose.models.Brand ?? mongoose.model("Brand", brandSchema, "brands");
export const DeviceModel =
  mongoose.models.DeviceModel ?? mongoose.model("DeviceModel", modelSchema, "models");
export const Issue = mongoose.models.Issue ?? mongoose.model("Issue", issueSchema, "issues");
export const Estimate =
  mongoose.models.Estimate ?? mongoose.model("Estimate", estimateSchema, "estimates");
export const AuditLog =
  mongoose.models.AuditLog ?? mongoose.model("AuditLog", auditLogSchema, "audit_logs");
export const CourseNotify =
  mongoose.models.CourseNotify ?? mongoose.model("CourseNotify", courseNotifySchema, "course_notifies");
export const Counter =
  mongoose.models.Counter ?? mongoose.model("Counter", counterSchema, "counters");
