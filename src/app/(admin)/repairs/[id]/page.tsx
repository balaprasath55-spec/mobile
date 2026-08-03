import type { Metadata } from "next";
import { LocalRepairDetail, RepairDetailView } from "@/components/admin/repair-detail-view";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getStore().repairs.find((x) => x.id === params.id);
  return { title: r?.jobId ?? "Repair" };
}

export default async function RepairDetailPage({ params }: Props) {
  const store = getStore();
  const repair = store.repairs.find((r) => r.id === params.id);
  const customer = repair ? store.customers.find((c) => c.id === repair.customerId) : null;

  if (repair && customer) {
    return <RepairDetailView repair={repair} customer={customer} />;
  }

  // Amplify: new jobs are saved in the browser — hydrate from localStorage
  return <LocalRepairDetail id={params.id} />;
}
