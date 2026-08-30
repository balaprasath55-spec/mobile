import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RepairDetailView } from "@/components/admin/repair-detail-view";
import { getCustomerById, getRepairById } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getRepairById(params.id);
  return { title: r?.jobId ?? "Repair" };
}

export default async function RepairDetailPage({ params }: Props) {
  const repair = await getRepairById(params.id);
  if (!repair) notFound();

  const customer = await getCustomerById(repair.customerId);
  if (!customer) notFound();

  return <RepairDetailView repair={repair} customer={customer} />;
}
