import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RepairDetailView } from "@/components/admin/repair-detail-view";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";
import {
  fetchCatalogBrands,
  fetchCatalogModels,
  inferBrandIdFromModelId,
  serverApi,
} from "@/lib/server-api";

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

  const brandId = inferBrandIdFromModelId(repair.modelId);
  const [brands, initialModels] = await Promise.all([
    fetchCatalogBrands(),
    brandId ? fetchCatalogModels(brandId) : Promise.resolve([]),
  ]);

  return (
    <RepairDetailView repair={repair} customer={customer} brands={brands} initialModels={initialModels} />
  );
}
