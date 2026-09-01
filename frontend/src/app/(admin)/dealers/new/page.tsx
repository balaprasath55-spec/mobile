import type { Metadata } from "next";
import { DealerForm } from "@/components/admin/dealer-form";

export const metadata: Metadata = { title: "Add dealer" };

export default function NewDealerPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Add dealer</h1>
        <p className="mt-1 text-sm text-muted">Register a shop that drops off mobiles for repair in bulk.</p>
      </div>
      <DealerForm />
    </div>
  );
}
