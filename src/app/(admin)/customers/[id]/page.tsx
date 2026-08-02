import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { CustomerForm } from "@/components/admin/customer-form";
import { DataTable } from "@/components/admin/data-table";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getModelWithBrand, getStore } from "@/lib/demo-store";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getStore().customers.find((x) => x.id === params.id);
  return { title: c?.name ? `Customer · ${c.name}` : "Customer" };
}

export default async function CustomerDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const store = getStore();
  const customer = store.customers.find((c) => c.id === params.id);
  if (!customer) notFound();

  const repairs = store.repairs
    .filter((r) => r.customerId === customer.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Customer</p>
          <h1 className="font-display text-2xl font-semibold text-navy dark:text-white">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {customer.phone}
            {customer.location ? ` · ${customer.location}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="accent">
            <Link href={`/repairs/new?customerId=${customer.id}`}>New job</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/customers/${customer.id}/print`} target="_blank">
              Print receipt
            </Link>
          </Button>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-navy dark:text-white">Profile</h2>
        <CustomerForm customerId={customer.id} initial={customer} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy dark:text-white">Repair history</h2>
          <Button asChild size="sm" variant="outline">
            <Link href={`/repairs/new?customerId=${customer.id}`}>New job for this customer</Link>
          </Button>
        </div>
        <DataTable columns={["Job ID", "Device", "Issue", "Status", "Amount", "Date", ""]} empty={repairs.length === 0}>
          {repairs.map((r) => {
            const model = getModelWithBrand(r.modelId);
            const device =
              model
                ? `${model.brand.name} ${model.name}`
                : [r.deviceBrandRaw, r.deviceModelRaw].filter(Boolean).join(" ") || "—";
            return (
              <tr key={r.id} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 font-mono text-xs">{r.jobId}</td>
                <td className="px-4 py-3 text-muted">{device}</td>
                <td className="px-4 py-3 text-navy dark:text-white">{r.issue}</td>
                <td className="px-4 py-3">
                  <JobStatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-muted">{r.amount != null ? formatINR(r.amount) : "—"}</td>
                <td className="px-4 py-3 text-muted">{format(r.createdAt, "dd MMM yyyy")}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/repairs/${r.id}`} className="text-sm text-accent">
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </section>
    </div>
  );
}
