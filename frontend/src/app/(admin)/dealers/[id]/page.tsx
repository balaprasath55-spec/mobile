import type { Metadata } from "next";
import { format } from "date-fns";
import { AdminLink } from "@/components/admin/admin-link";
import { DealerForm } from "@/components/admin/dealer-form";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import type { DemoDealer, DemoDealerBatch, DemoRepair } from "@/lib/demo-store";
import { serverApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Dealer" };

export default async function DealerDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { batch?: string };
}) {
  const data = await serverApi<{
    dealer: DemoDealer & {
      pendingJobs: number;
      batches: DemoDealerBatch[];
      repairs: DemoRepair[];
    };
  }>(`/api/dealers/${params.id}`);

  const { dealer } = data;
  const savedBatch = searchParams.batch;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Dealer</p>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">{dealer.shopName}</h1>
          <p className="mt-1 text-sm text-muted">
            {dealer.name} · <a href={`tel:${dealer.phone}`} className="text-accent">{dealer.phone}</a>
            {dealer.location ? ` · ${dealer.location}` : ""}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium text-navy dark:text-white">{dealer.pendingJobs}</span>{" "}
            <span className="text-muted">pending jobs</span>
          </p>
        </div>
        <Button asChild variant="accent" className="w-full sm:w-auto">
          <AdminLink href={`/dealers/${dealer.id}/batch/new`}>Add batch (bulk)</AdminLink>
        </Button>
      </div>

      {savedBatch ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          Batch <span className="font-mono font-medium">{savedBatch}</span> saved successfully.
        </p>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-white">Recent batches</h2>
        <ul className="space-y-2">
          {dealer.batches.map((b) => (
            <li key={b.id} className="rounded-2xl bg-white px-4 py-3 soft-shadow dark:bg-navy-800">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium text-accent">{b.batchRef}</span>
                <span className="text-xs text-muted">{format(b.createdAt, "dd MMM yyyy")}</span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {b.deviceCount} device{b.deviceCount === 1 ? "" : "s"}
                {b.notes ? ` · ${b.notes}` : ""}
              </p>
            </li>
          ))}
          {dealer.batches.length === 0 ? (
            <li className="rounded-2xl bg-white p-6 text-center text-sm text-muted dark:bg-navy-800">
              No batches yet. Use &quot;Add batch&quot; to register 10–15 mobiles at once.
            </li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy dark:text-white">All dealer jobs</h2>
        <ul className="space-y-2">
          {dealer.repairs.map((r) => (
            <li key={r.id}>
              <AdminLink
                href={`/repairs/${r.id}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 soft-shadow dark:bg-navy-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy dark:text-white">{r.issue}</p>
                  <p className="truncate text-xs text-muted">
                    {[r.deviceBrandRaw, r.deviceModelRaw].filter(Boolean).join(" ") || "Device"} · {r.jobId}
                  </p>
                </div>
                <JobStatusBadge status={r.status} />
              </AdminLink>
            </li>
          ))}
          {dealer.repairs.length === 0 ? (
            <li className="rounded-2xl bg-white p-6 text-center text-sm text-muted dark:bg-navy-800">No jobs yet.</li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-navy dark:text-white">Edit dealer</h2>
        <DealerForm
          dealerId={dealer.id}
          initial={{
            name: dealer.name,
            shopName: dealer.shopName,
            phone: dealer.phone,
            location: dealer.location,
            notes: dealer.notes,
          }}
        />
      </section>
    </div>
  );
}
