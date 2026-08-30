import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RepairDetailView } from "@/components/admin/repair-detail-view";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await serverApi<{ repair: DemoRepair }>(`/api/repairs/${params.id}`);
    return { title: data.repair?.jobId ?? "Repair" };
  } catch {
    return { title: "Repair" };
  }
}

export default async function RepairDetailPage({ params }: Props) {
  let repair: DemoRepair;
  let customer: DemoCustomer;
  try {
    const data = await serverApi<{ repair: DemoRepair & { customer: DemoCustomer } }>(
      `/api/repairs/${params.id}`
    );
    repair = data.repair;
    customer = data.repair.customer;
  } catch {
    notFound();
  }

  return <RepairDetailView repair={repair} customer={customer} />;
}
