import { readFileSync } from "fs";
import path from "path";
import type { DemoCustomer, DemoRepair, DemoRepairStatus } from "@/lib/demo-store";

export type ShopOrderRow = {
  sNo: number;
  orderId: string;
  customerName: string;
  phoneNo: string;
  phoneName: string;
  phoneModel: string;
  imeiNumber: string;
  orderDate: string;
  orderStatus: string;
};

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function mapOrderStatus(raw: string): DemoRepairStatus {
  const s = raw.trim();
  if (s === "Canceled") return "CLOSED";
  if (/delivered/i.test(s)) return "DELIVERED";
  if (/pending/i.test(s)) return "RECEIVED";
  if (/processing|in progress/i.test(s)) return "IN_REPAIR";
  if (/completed/i.test(s)) return "READY_FOR_DELIVERY";
  return "RECEIVED";
}

function loadOrders(): ShopOrderRow[] {
  const file = path.join(process.cwd(), "mobile_zone_service.json");
  const raw = JSON.parse(readFileSync(file, "utf8")) as ShopOrderRow[];
  return Array.isArray(raw) ? raw : [];
}

export function buildShopRecords(): { customers: DemoCustomer[]; repairs: DemoRepair[]; jobSeq: number } {
  const orders = loadOrders();
  const customerByPhone = new Map<string, DemoCustomer>();
  const repairs: DemoRepair[] = [];

  for (const row of orders) {
    const phone = normalizePhone(row.phoneNo);
    if (!phone) continue;

    let customer = customerByPhone.get(phone);
    if (!customer) {
      customer = {
        id: `cust_${phone}`,
        name: row.customerName.trim() || "Customer",
        phone,
        altPhone: null,
        address: null,
        location: "Chennai",
        createdAt: new Date(row.orderDate),
      };
      customerByPhone.set(phone, customer);
    } else if (new Date(row.orderDate) < customer.createdAt) {
      customer.createdAt = new Date(row.orderDate);
    }

    const brand = row.phoneName?.trim() || "Unknown";
    const model = row.phoneModel?.trim() || "Unknown";
    const imei =
      row.imeiNumber && row.imeiNumber !== "-" ? row.imeiNumber.trim() : null;
    const status = mapOrderStatus(row.orderStatus);
    const createdAt = new Date(row.orderDate);

    repairs.push({
      id: `rep_${row.sNo}`,
      jobId: row.orderId.startsWith("ORD-") ? row.orderId : `ORD-${row.orderId}`,
      customerId: customer.id,
      modelId: null,
      deviceBrandRaw: brand,
      deviceModelRaw: model,
      imei,
      issue: `${brand} ${model}`.trim(),
      status,
      technicianId: null,
      amount: null,
      advancePaid: 0,
      deliveryDate: null,
      deliveredAt: status === "DELIVERED" ? createdAt : null,
      notes: row.orderStatus,
      imageUrl: null,
      createdAt,
    });
  }

  const nameByCustomerId = new Map<string, string>();
  Array.from(customerByPhone.values()).forEach((customer) => {
    nameByCustomerId.set(customer.id, customer.name);
  });

  repairs.sort((a, b) => {
    const byName = (nameByCustomerId.get(a.customerId) ?? "").localeCompare(
      nameByCustomerId.get(b.customerId) ?? "",
      "en",
      { sensitivity: "base", numeric: true }
    );
    if (byName !== 0) return byName;
    return a.jobId.localeCompare(b.jobId, "en", { numeric: true });
  });

  const customers = Array.from(customerByPhone.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base", numeric: true })
  );

  const maxSNo = orders.reduce((m, r) => Math.max(m, r.sNo), 0);

  return { customers, repairs, jobSeq: maxSNo + 1 };
}
