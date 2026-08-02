import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { RepairForm } from "@/components/admin/repair-form";
import { StatusWorkflow } from "@/components/admin/status-workflow";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getStore } from "@/lib/demo-store";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getStore().repairs.find((x) => x.id === params.id);
  return { title: r?.jobId ?? "Repair" };
}

export default async function RepairDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const store = getStore();
  const repair = store.repairs.find((r) => r.id === params.id);
  if (!repair) notFound();
  const customer = store.customers.find((c) => c.id === repair.customerId);
  if (!customer) notFound();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm text-accent">{repair.jobId}</p>
          <h1 className="mt-1 font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
            {repair.issue}
          </h1>
          <p className="mt-1 text-sm text-muted">
            <Link href={`/customers/${repair.customerId}`} className="text-accent hover:underline">
              {customer.name}
            </Link>{" "}
            · <a href={`tel:${customer.phone}`} className="text-accent">{customer.phone}</a>
            <span className="block sm:inline"> · {format(repair.createdAt, "dd MMM yyyy HH:mm")}</span>
          </p>
          <div className="mt-3">
            <JobStatusBadge status={repair.status} />
          </div>
        </div>
        <div className="w-full text-left text-sm sm:w-auto sm:text-right">
          <p className="text-muted">Amount</p>
          <p className="font-display text-2xl font-semibold text-navy dark:text-white">
            {repair.amount != null ? formatINR(repair.amount) : "—"}
          </p>
          <p className="mt-1 text-muted">Advance {formatINR(repair.advancePaid)}</p>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full sm:w-auto">
            <Link href={`/customers/${repair.customerId}/print?jobId=${repair.id}`} target="_blank">
              Print receipt
            </Link>
          </Button>
        </div>
      </div>

      {repair.imageUrl ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy dark:text-white">Photo</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={repair.imageUrl}
            alt="Device issue"
            className="max-h-72 w-full rounded-2xl object-cover soft-shadow md:max-w-md"
          />
        </section>
      ) : null}

      <StatusWorkflow repairId={repair.id} status={repair.status} />

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-navy dark:text-white">Edit job</h2>
        <RepairForm
          customerId={repair.customerId}
          repairId={repair.id}
          initial={{
            issue: repair.issue,
            deviceBrandRaw: repair.deviceBrandRaw,
            deviceModelRaw: repair.deviceModelRaw,
            modelId: repair.modelId,
            imei: repair.imei,
            amount: repair.amount,
            advancePaid: repair.advancePaid,
            warrantyDays: repair.warrantyDays,
            notes: repair.notes,
          }}
        />
      </section>
    </div>
  );
}
