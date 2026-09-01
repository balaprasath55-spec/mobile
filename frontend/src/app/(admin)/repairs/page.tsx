import { Suspense } from "react";
import { AdminLink } from "@/components/admin/admin-link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import type { DemoCustomer, DemoRepair, DemoRepairStatus } from "@/lib/demo-store";
import { REPAIR_STATUS_FLOW, REPAIR_STATUS_LABELS } from "@/lib/repairs";
import { highlightSequentialMatch } from "@/lib/search-utils";
import { serverApi } from "@/lib/server-api";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Repairs" };

type RepairRow = DemoRepair & {
  customer: Pick<DemoCustomer, "id" | "name" | "phone">;
};

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const qDisplay = searchParams.q?.trim() ?? "";
  const status = searchParams.status as DemoRepairStatus | undefined;
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 20;

  const validStatus = status && REPAIR_STATUS_FLOW.includes(status) ? status : undefined;
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize), jobSource: "WALK_IN" });
  if (qDisplay) qs.set("q", qDisplay);
  if (validStatus) qs.set("status", validStatus);

  const data = await serverApi<{
    repairs: RepairRow[];
    pagination: { total: number; totalPages: number };
  }>(`/api/repairs?${qs}`);

  const repairs = data.repairs;
  const total = data.pagination.total;
  const totalPages = data.pagination.totalPages;
  const customerMap = new Map(repairs.map((r) => [r.customerId, r.customer]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Walk-in jobs</h1>
          <p className="mt-1 text-sm text-muted">{total} walk-in · dealer jobs are under Dealers</p>
        </div>
        <Button asChild variant="accent" className="hidden md:inline-flex">
          <AdminLink href="/dashboard">New job</AdminLink>
        </Button>
      </div>

      <Suspense fallback={<div className="mt-4 h-11 animate-pulse rounded-2xl bg-white dark:bg-navy-800" />}>
        <AdminSearchBar
          placeholder="Search job, name, phone…"
          selects={[
            {
              name: "status",
              options: [
                { value: "", label: "All statuses" },
                ...REPAIR_STATUS_FLOW.map((s) => ({ value: s, label: REPAIR_STATUS_LABELS[s] })),
              ],
            },
          ]}
        />
      </Suspense>

      <ul className="mt-4 space-y-2 md:hidden">
        {repairs.map((r) => {
          const customer = customerMap.get(r.customerId)!;
          return (
            <li key={r.id}>
              <AdminLink
                href={`/repairs/${r.id}`}
                className="flex items-start gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
              >
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface text-xs text-muted dark:bg-navy-900">
                    No pic
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy dark:text-white">
                    {highlightSequentialMatch(r.issue, qDisplay)}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {highlightSequentialMatch(customer.name, qDisplay)} · {highlightSequentialMatch(customer.phone, qDisplay)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{highlightSequentialMatch(r.jobId, qDisplay)}</p>
                </div>
                <JobStatusBadge status={r.status} />
              </AdminLink>
            </li>
          );
        })}
        {repairs.length === 0 ? (
          <li className="rounded-2xl bg-white p-8 text-center text-sm text-muted dark:bg-navy-800">No jobs found.</li>
        ) : null}
      </ul>

      <div className="mt-6 hidden md:block">
        <DataTable columns={["Job ID", "Customer", "Issue", "Status", "Amount", "Date", ""]} empty={repairs.length === 0}>
          {repairs.map((r) => {
            const customer = customerMap.get(r.customerId)!;
            return (
              <tr key={r.id} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 font-mono text-xs">{highlightSequentialMatch(r.jobId, qDisplay)}</td>
                <td className="px-4 py-3">
                  <AdminLink href={`/customers/${customer.id}`} className="font-medium text-navy hover:text-accent dark:text-white">
                    {highlightSequentialMatch(customer.name, qDisplay)}
                  </AdminLink>
                  <p className="text-xs text-muted">{highlightSequentialMatch(customer.phone, qDisplay)}</p>
                </td>
                <td className="px-4 py-3 text-muted">{highlightSequentialMatch(r.issue, qDisplay)}</td>
                <td className="px-4 py-3">
                  <JobStatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-muted">{r.amount != null ? formatINR(r.amount) : "N/A"}</td>
                <td className="px-4 py-3 text-muted">{format(r.createdAt, "dd MMM yyyy")}</td>
                <td className="px-4 py-3 text-right">
                  <AdminLink href={`/repairs/${r.id}`} className="text-sm text-accent">
                    Open
                  </AdminLink>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </div>
      <Pagination page={page} totalPages={totalPages} basePath="/repairs" query={{ q: searchParams.q, status }} />
    </div>
  );
}
