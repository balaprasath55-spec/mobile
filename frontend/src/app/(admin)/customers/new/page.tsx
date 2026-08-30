import type { Metadata } from "next";
import { CustomerForm } from "@/components/admin/customer-form";

export const metadata: Metadata = { title: "New customer" };

export default async function NewCustomerPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy dark:text-white">New customer</h1>
      <p className="mt-1 text-sm text-muted">Add a walk-in or phone enquiry as a customer record.</p>
      <div className="mt-8">
        <CustomerForm />
      </div>
    </div>
  );
}
