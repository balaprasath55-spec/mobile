import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import { usingMemoryFallback } from "@/lib/db/backend";
import {
  buildAttendanceCsv,
  countCustomers,
  countEnquiries,
  countRepairs,
  createCourseNotify,
  createCustomer,
  createEnquiry,
  createRepair,
  deleteCustomer,
  deleteEnquiry,
  deleteRepair,
  findCustomerByPhone,
  getAttendanceForDate,
  getCustomerById,
  getEnquiryById,
  getEstimate,
  getModelWithBrand,
  getRecentRepairs,
  getRepairById,
  getRepairCount,
  getRepairsForCustomer,
  listBrands,
  listEmployees,
  listEnquiries,
  listIssues,
  listModels,
  queryCustomers,
  queryRepairs,
  updateCustomer,
  updateEnquiryStatus,
  updateRepair,
  upsertAttendanceBulk,
  writeAudit,
} from "@/lib/db";
import {
  countDealerPendingJobs,
  createDealer,
  createDealerBatch,
  getDealerById,
  listDealerBatches,
  queryDealers,
  updateDealer,
} from "@/lib/dealers";
import type { DemoEnquiryStatus, DemoRepairStatus } from "@/lib/demo-store";
import { normalizeRepairIntakeChecks } from "@/lib/repair-intake";
import { emptyToNull } from "@/lib/repairs";
import {
  attendanceBulkSchema,
  attendanceExportQuerySchema,
  courseNotifySchema,
  customerSchema,
  dealerBatchSchema,
  dealerSchema,
  enquirySchema,
  enquiryStatusSchema,
  estimateQuerySchema,
  repairSchema,
  repairStatusSchema,
} from "@/lib/validators";

export const apiRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const quickJobSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone is required")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone"),
  issue: z.string().min(2, "Issue is required"),
  imageUrl: z.string().min(1, "Photo is required"),
  modelId: z.string().optional().nullable().or(z.literal("")),
  deviceBrandRaw: z.string().optional().or(z.literal("")),
  deviceModelRaw: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().nonnegative().optional().nullable(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  intakeChecks: z.any().optional(),
});

function asyncHandler(
  fn: (req: import("express").Request, res: import("express").Response) => Promise<void>
) {
  return (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
    fn(req, res).catch(next);
  };
}

apiRouter.get(
  "/meta",
  asyncHandler(async (_req, res) => {
    res.json({ memoryFallback: usingMemoryFallback() });
  })
);

apiRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    await requireAdmin();
    const pending = await countRepairs({
      status: ["RECEIVED", "IN_REPAIR"],
      walkInOnly: true,
    });
    const newEnquiries = await countEnquiries("NEW");
    const customerCount = await countCustomers();
    const recent = await getRecentRepairs(6);
    const recentWithCustomers = await Promise.all(
      recent.map(async (r) => ({
        repair: r,
        customer: await getCustomerById(r.customerId),
      }))
    );
    res.json({ pending, newEnquiries, customerCount, recentWithCustomers });
  })
);

apiRouter.get(
  "/stats/repair-count",
  asyncHandler(async (_req, res) => {
    res.json({ count: await getRepairCount() });
  })
);

apiRouter.get(
  "/brands",
  asyncHandler(async (_req, res) => {
    const brands = await listBrands();
    res.json({ brands: brands.map(({ id, name }) => ({ id, name })) });
  })
);

apiRouter.get(
  "/models",
  asyncHandler(async (req, res) => {
    const brandId = typeof req.query.brandId === "string" ? req.query.brandId : undefined;
    const models = await listModels(brandId);
    res.json({ models: models.map(({ id, brandId: b, name }) => ({ id, brandId: b, name })) });
  })
);

apiRouter.get(
  "/issues",
  asyncHandler(async (_req, res) => {
    const issues = await listIssues();
    res.json({ issues: issues.map(({ id, name }) => ({ id, name })) });
  })
);

apiRouter.get(
  "/estimate",
  asyncHandler(async (req, res) => {
    const parsed = estimateQuerySchema.safeParse({
      modelId: req.query.modelId,
      issueId: req.query.issueId,
    });
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const estimate = await getEstimate(parsed.data.modelId, parsed.data.issueId);
    if (!estimate) {
      res.status(404).json({ error: "No estimate for that combination" });
      return;
    }
    res.json({
      estimate,
      priceMin: estimate.priceMin,
      priceMax: estimate.priceMax,
    });
  })
);

apiRouter.post(
  "/course/notify",
  asyncHandler(async (req, res) => {
    const parsed = courseNotifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    await createCourseNotify(parsed.data);
    res.status(201).json({ ok: true });
  })
);

apiRouter.get(
  "/customers",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize ?? 20)));
    const location = typeof req.query.location === "string" ? req.query.location.trim() : "";
    const { customers, total } = await queryCustomers({ q, location, page, pageSize });
    const enriched = await Promise.all(
      customers.map(async (c) => {
        const repairs = await getRepairsForCustomer(c.id);
        return {
          ...c,
          _count: { repairs: repairs.length },
          repairs: repairs.slice(0, 1).map((r) => ({
            jobId: r.jobId,
            status: r.status,
            createdAt: r.createdAt,
          })),
        };
      })
    );
    res.json({
      customers: enriched,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
      memoryFallback: usingMemoryFallback(),
    });
  })
);

apiRouter.post(
  "/customers",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = customerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const customer = await createCustomer({
      name: parsed.data.name,
      phone: parsed.data.phone.replace(/\s+/g, ""),
      altPhone: emptyToNull(parsed.data.altPhone),
      address: emptyToNull(parsed.data.address),
      location: emptyToNull(parsed.data.location),
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Customer",
      entityId: customer.id,
      changes: customer,
    });
    res.status(201).json({ customer });
  })
);

apiRouter.get(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const repairs = await getRepairsForCustomer(req.params.id);
    const withModels = await Promise.all(
      repairs.map(async (r) => ({
        ...r,
        model: await getModelWithBrand(r.modelId),
        technician: null,
      }))
    );
    res.json({ customer: { ...customer, repairs: withModels } });
  })
);

apiRouter.put(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = customerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const customer = await updateCustomer(req.params.id, {
      name: parsed.data.name,
      phone: parsed.data.phone.replace(/\s+/g, ""),
      altPhone: emptyToNull(parsed.data.altPhone),
      address: emptyToNull(parsed.data.address),
      location: emptyToNull(parsed.data.location),
    });
    if (!customer) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "UPDATE",
      entityType: "Customer",
      entityId: req.params.id,
      changes: customer,
    });
    res.json({ customer });
  })
);

apiRouter.delete(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin("ADMIN");
    const cascade = req.query.cascade === "true";
    const existing = await getCustomerById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const ok = await deleteCustomer(req.params.id, cascade);
    if (!ok) {
      res.status(400).json({
        error: cascade
          ? "Could not delete customer."
          : "This customer has repair jobs. Confirm again to delete the customer and all their jobs.",
      });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "DELETE",
      entityType: "Customer",
      entityId: req.params.id,
      changes: { name: existing.name, phone: existing.phone, cascade },
    });
    res.json({ ok: true });
  })
);

apiRouter.get(
  "/repairs",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const status = (typeof req.query.status === "string" ? req.query.status : undefined) as
      | DemoRepairStatus
      | undefined;
    const customerId = typeof req.query.customerId === "string" ? req.query.customerId : undefined;
    const dealerId = typeof req.query.dealerId === "string" ? req.query.dealerId : undefined;
    const batchId = typeof req.query.batchId === "string" ? req.query.batchId : undefined;
    const jobSource =
      req.query.jobSource === "DEALER" || req.query.jobSource === "ALL"
        ? req.query.jobSource
        : "WALK_IN";
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize ?? 20)));
    const { repairs, total, customerMap } = await queryRepairs({
      q,
      status,
      customerId,
      dealerId,
      batchId,
      jobSource,
      page,
      pageSize,
    });
    const enriched = await Promise.all(
      repairs.map(async (r) => {
        const customer = customerMap.get(r.customerId)!;
        return {
          ...r,
          customer: { id: customer.id, name: customer.name, phone: customer.phone },
          model: await getModelWithBrand(r.modelId),
          technician: null,
        };
      })
    );
    res.json({
      repairs: enriched,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    });
  })
);

apiRouter.post(
  "/repairs",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = repairSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const customer = await getCustomerById(parsed.data.customerId);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    const repair = await createRepair({
      customerId: parsed.data.customerId,
      source: "WALK_IN",
      dealerId: null,
      batchId: null,
      modelId: emptyToNull(parsed.data.modelId),
      deviceBrandRaw: emptyToNull(parsed.data.deviceBrandRaw),
      deviceModelRaw: emptyToNull(parsed.data.deviceModelRaw),
      imei: emptyToNull(parsed.data.imei),
      issue: parsed.data.issue,
      technicianId: emptyToNull(parsed.data.technicianId),
      amount: parsed.data.amount ?? null,
      advancePaid: parsed.data.advancePaid ?? 0,
      notes: emptyToNull(parsed.data.notes),
      deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
      intakeChecks: normalizeRepairIntakeChecks(parsed.data.intakeChecks),
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Repair",
      entityId: repair.id,
      changes: { jobId: repair.jobId, customerId: repair.customerId, issue: repair.issue },
    });
    res.status(201).json({ repair: { ...repair, customer } });
  })
);

apiRouter.get(
  "/repairs/:id",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const repair = await getRepairById(req.params.id);
    if (!repair) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const customer = await getCustomerById(repair.customerId);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({
      repair: {
        ...repair,
        customer,
        model: await getModelWithBrand(repair.modelId),
        technician: null,
        images: [],
        parts: [],
      },
    });
  })
);

apiRouter.put(
  "/repairs/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = repairSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const repair = await updateRepair(req.params.id, {
      customerId: parsed.data.customerId,
      modelId: emptyToNull(parsed.data.modelId),
      deviceBrandRaw: emptyToNull(parsed.data.deviceBrandRaw),
      deviceModelRaw: emptyToNull(parsed.data.deviceModelRaw),
      imei: emptyToNull(parsed.data.imei),
      issue: parsed.data.issue,
      technicianId: emptyToNull(parsed.data.technicianId),
      amount: parsed.data.amount ?? null,
      advancePaid: parsed.data.advancePaid ?? 0,
      notes: emptyToNull(parsed.data.notes),
      deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
      intakeChecks: normalizeRepairIntakeChecks(parsed.data.intakeChecks),
    });
    if (!repair) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "UPDATE",
      entityType: "Repair",
      entityId: req.params.id,
      changes: repair,
    });
    const customer = await getCustomerById(repair.customerId);
    res.json({ repair: { ...repair, customer } });
  })
);

apiRouter.delete(
  "/repairs/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin("ADMIN");
    const existing = await getRepairById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const ok = await deleteRepair(req.params.id);
    if (!ok) {
      res.status(500).json({ error: "Could not delete job." });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "DELETE",
      entityType: "Repair",
      entityId: req.params.id,
      changes: { jobId: existing.jobId, customerId: existing.customerId, issue: existing.issue },
    });
    res.json({ ok: true });
  })
);

apiRouter.patch(
  "/repairs/:id/status",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = repairStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const existing = await getRepairById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const repair = await updateRepair(req.params.id, { status: parsed.data.status });
    await writeAudit({
      adminUserId: auth.userId,
      action: "STATUS_CHANGE",
      entityType: "Repair",
      entityId: req.params.id,
      changes: { from: existing.status, to: parsed.data.status },
    });
    res.json({ repair });
  })
);

apiRouter.get(
  "/enquiries",
  asyncHandler(async (_req, res) => {
    await requireAdmin();
    const enquiries = await listEnquiries();
    res.json({ enquiries });
  })
);

apiRouter.post(
  "/enquiries",
  asyncHandler(async (req, res) => {
    try {
      const parsed = enquirySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const enquiry = await createEnquiry({
        name: parsed.data.name,
        phone: parsed.data.phone,
        device: parsed.data.device || null,
        issue: parsed.data.issue,
        location: parsed.data.location || null,
        message: parsed.data.message || null,
        imageUrl: parsed.data.imageUrl,
      });
      res.status(201).json({ id: enquiry.id, ok: true });
    } catch {
      res.status(500).json({ error: "Unable to save enquiry" });
    }
  })
);

apiRouter.get(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const enquiry = await getEnquiryById(req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ enquiry });
  })
);

apiRouter.put(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = enquiryStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const enquiry = await getEnquiryById(req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const from = enquiry.status;
    const updated = await updateEnquiryStatus(req.params.id, parsed.data.status as DemoEnquiryStatus);
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "STATUS_CHANGE",
      entityType: "Enquiry",
      entityId: req.params.id,
      changes: { from, to: updated.status },
    });
    res.json({ enquiry: updated });
  })
);

apiRouter.post(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const body = (req.body ?? {}) as { createJob?: boolean };
    const enquiry = await getEnquiryById(req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const phone = enquiry.phone.replace(/\s+/g, "");
    let customer = await findCustomerByPhone(phone);
    if (!customer) {
      customer = await createCustomer({
        name: enquiry.name,
        phone,
        altPhone: null,
        address: null,
        location: enquiry.location,
      });
      await writeAudit({
        adminUserId: auth.userId,
        action: "CREATE",
        entityType: "Customer",
        entityId: customer.id,
        changes: { fromEnquiry: enquiry.id },
      });
    }
    let repair = null;
    if (body.createJob !== false) {
      repair = await createRepair({
        customerId: customer.id,
        source: "WALK_IN",
        dealerId: null,
        batchId: null,
        modelId: null,
        deviceBrandRaw: null,
        deviceModelRaw: enquiry.device,
        imei: null,
        issue: enquiry.issue || "Enquiry conversion",
        technicianId: null,
        amount: null,
        advancePaid: 0,
        notes: enquiry.message,
        deliveryDate: null,
        imageUrl: enquiry.imageUrl,
        intakeChecks: normalizeRepairIntakeChecks(),
      });
      await writeAudit({
        adminUserId: auth.userId,
        action: "CREATE",
        entityType: "Repair",
        entityId: repair.id,
        changes: { fromEnquiry: enquiry.id, jobId: repair.jobId },
      });
    }
    const updated = await updateEnquiryStatus(req.params.id, "CONVERTED");
    res.json({ customer, repair, enquiry: updated });
  })
);

apiRouter.delete(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin("ADMIN");
    const existing = await getEnquiryById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const ok = await deleteEnquiry(req.params.id);
    if (!ok) {
      res.status(500).json({ error: "Could not delete enquiry." });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "DELETE",
      entityType: "Enquiry",
      entityId: req.params.id,
      changes: { name: existing.name, phone: existing.phone },
    });
    res.json({ ok: true });
  })
);

apiRouter.post(
  "/jobs/quick",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = quickJobSchema.safeParse(req.body);
    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ||
        parsed.error.flatten().formErrors[0] ||
        "Invalid input";
      res.status(400).json({ error: first });
      return;
    }
    const phone = parsed.data.phone.replace(/\s+/g, "");
    let customer = await findCustomerByPhone(phone);
    if (!customer) {
      customer = await createCustomer({
        name: parsed.data.name,
        phone,
        altPhone: null,
        address: null,
        location: parsed.data.location || null,
      });
      await writeAudit({
        adminUserId: auth.userId,
        action: "CREATE",
        entityType: "Customer",
        entityId: customer.id,
        changes: { name: customer.name, phone },
      });
    }
    const repair = await createRepair({
      customerId: customer.id,
      source: "WALK_IN",
      dealerId: null,
      batchId: null,
      modelId: parsed.data.modelId || null,
      deviceBrandRaw: parsed.data.deviceBrandRaw || null,
      deviceModelRaw: parsed.data.deviceModelRaw || null,
      imei: null,
      issue: parsed.data.issue,
      technicianId: null,
      amount: parsed.data.amount ?? null,
      advancePaid: 0,
      notes: parsed.data.notes || null,
      deliveryDate: null,
      imageUrl: parsed.data.imageUrl,
      intakeChecks: normalizeRepairIntakeChecks(parsed.data.intakeChecks),
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Repair",
      entityId: repair.id,
      changes: { jobId: repair.jobId, issue: repair.issue },
    });
    res.status(201).json({ customer, repair });
  })
);

apiRouter.get(
  "/dealers",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize ?? 20)));
    const { dealers, total } = await queryDealers({ q, page, pageSize });
    const enriched = await Promise.all(
      dealers.map(async (d) => ({
        ...d,
        pendingJobs: await countDealerPendingJobs(d.id),
        batchCount: (await listDealerBatches(d.id)).length,
      }))
    );
    res.json({
      dealers: enriched,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    });
  })
);

apiRouter.post(
  "/dealers",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = dealerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const dealer = await createDealer({
      name: parsed.data.name,
      shopName: parsed.data.shopName,
      phone: parsed.data.phone,
      location: emptyToNull(parsed.data.location),
      notes: emptyToNull(parsed.data.notes),
    });
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "Dealer",
      entityId: dealer.id,
      changes: dealer,
    });
    res.status(201).json({ dealer });
  })
);

apiRouter.get(
  "/dealers/:id",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const dealer = await getDealerById(req.params.id);
    if (!dealer) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const batches = await listDealerBatches(dealer.id);
    const { repairs } = await queryRepairs({
      dealerId: dealer.id,
      jobSource: "ALL",
      page: 1,
      pageSize: 50,
    });
    res.json({
      dealer: {
        ...dealer,
        pendingJobs: await countDealerPendingJobs(dealer.id),
        batches,
        repairs,
      },
    });
  })
);

apiRouter.put(
  "/dealers/:id",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = dealerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const dealer = await updateDealer(req.params.id, {
      name: parsed.data.name,
      shopName: parsed.data.shopName,
      phone: parsed.data.phone,
      location: emptyToNull(parsed.data.location),
      notes: emptyToNull(parsed.data.notes),
    });
    if (!dealer) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "UPDATE",
      entityType: "Dealer",
      entityId: dealer.id,
      changes: dealer,
    });
    res.json({ dealer });
  })
);

apiRouter.post(
  "/dealers/:id/batches",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = dealerBatchSchema.safeParse(req.body);
    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ||
        parsed.error.flatten().formErrors[0] ||
        "Invalid input";
      res.status(400).json({ error: first });
      return;
    }
    const devices = parsed.data.devices.filter(
      (d) => d.deviceModelRaw.trim() || d.issue.trim()
    );
    if (devices.length === 0) {
      res.status(400).json({ error: "Add at least one device with model and issue" });
      return;
    }
    const result = await createDealerBatch(req.params.id, {
      notes: emptyToNull(parsed.data.notes),
      devices: devices.map((d) => ({
        deviceBrandRaw: emptyToNull(d.deviceBrandRaw),
        deviceModelRaw: d.deviceModelRaw.trim(),
        modelId: emptyToNull(d.modelId),
        issue: d.issue.trim(),
        imei: emptyToNull(d.imei),
        intakeChecks: normalizeRepairIntakeChecks(d.intakeChecks),
      })),
    });
    if (!result) {
      res.status(404).json({ error: "Dealer not found" });
      return;
    }
    await writeAudit({
      adminUserId: auth.userId,
      action: "CREATE",
      entityType: "DealerBatch",
      entityId: result.batch.id,
      changes: { batchRef: result.batch.batchRef, count: result.repairs.length },
    });
    res.status(201).json(result);
  })
);

apiRouter.post(
  "/uploads",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "Photo is required" });
      return;
    }
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
    if (!allowed.has(file.mimetype)) {
      res.status(400).json({ error: "Only JPG, PNG or WebP allowed" });
      return;
    }
    const mime = file.mimetype === "image/jpg" ? "image/jpeg" : file.mimetype;
    const url = `data:${mime};base64,${file.buffer.toString("base64")}`;
    res.status(201).json({ url });
  })
);

apiRouter.get(
  "/employees",
  asyncHandler(async (_req, res) => {
    await requireAdmin();
    const employees = await listEmployees();
    res.json({ employees });
  })
);

apiRouter.get(
  "/attendance/export",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const parsed = attendanceExportQuerySchema.safeParse({
      from: req.query.from,
      to: req.query.to,
    });
    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ||
        parsed.error.flatten().formErrors[0] ||
        "Invalid date range";
      res.status(400).json({ error: first });
      return;
    }
    const csv = await buildAttendanceCsv(parsed.data.from, parsed.data.to);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance-${parsed.data.from}-to-${parsed.data.to}.csv"`
    );
    res.send(`\uFEFF${csv}`);
  })
);

apiRouter.get(
  "/attendance",
  asyncHandler(async (req, res) => {
    await requireAdmin();
    const date =
      typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
        ? req.query.date
        : new Date().toISOString().slice(0, 10);
    const data = await getAttendanceForDate(date);
    res.json(data);
  })
);

apiRouter.put(
  "/attendance",
  asyncHandler(async (req, res) => {
    const auth = await requireAdmin();
    const parsed = attendanceBulkSchema.safeParse(req.body);
    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ||
        parsed.error.flatten().formErrors[0] ||
        "Invalid input";
      res.status(400).json({ error: first });
      return;
    }
    const records = await upsertAttendanceBulk(parsed.data);
    await writeAudit({
      adminUserId: auth.userId,
      action: "UPDATE",
      entityType: "Attendance",
      entityId: parsed.data.date,
      changes: { count: records.length, date: parsed.data.date },
    });
    res.json({ date: parsed.data.date, records });
  })
);
