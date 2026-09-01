import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/admin/admin-link";
import { DealerBatchForm } from "@/components/admin/dealer-batch-form";
import type { DemoDealer } from "@/lib/demo-store";
import { serverApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Dealer batch" };

export default async function DealerBatchNewPage({ params }: { params: { id: string } }) {
  let dealer: DemoDealer;
  try {
    const data = await serverApi<{ dealer: DemoDealer }>(`/api/dealers/${params.id}`);
    dealer = data.dealer;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <AdminLink href={`/dealers/${dealer.id}`} className="text-sm text-accent">
          ← {dealer.shopName}
        </AdminLink>
        <h1 className="mt-2 font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
          Bulk job intake
        </h1>
        <p className="mt-1 text-sm text-muted">Add multiple mobiles from this dealer in one batch (up to 20).</p>
      </div>
      <DealerBatchForm dealerId={dealer.id} dealerName={dealer.shopName} />
    </div>
  );
}
