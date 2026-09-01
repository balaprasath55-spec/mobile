import { Suspense } from "react";
import { AdminLink } from "@/components/admin/admin-link";
import type { Metadata } from "next";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";
import { highlightSequentialMatch } from "@/lib/search-utils";
import { serverApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Customers" };

type CustomerRow = DemoCustomer & {
  _count: { repairs: number };
  repairs: Pick<DemoRepair, "jobId" | "status" | "createdAt">[];
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string; location?: string; page?: string };
}) {
  const qDisplay = searchParams.q?.trim() ?? "";
  const location = searchParams.location?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 20;

  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (qDisplay) qs.set("q", qDisplay);
  if (location) qs.set("location", location);

  const data = await serverApi<{
    customers: CustomerRow[];
    pagination: { total: number; totalPages: number };
    memoryFallback?: boolean;
  }>(`/api/customers?${qs}`);

  const customers = data.customers;
  const total = data.pagination.total;
  const totalPages = data.pagination.totalPages;
  const memoryFallback = Boolean(data.memoryFallback);

  return (
    <div>
      <div className="mb-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
        {memoryFallback
          ? "MongoDB unavailable. Showing local shop data (resets on restart). Check Atlas network access."
          : "Data stored in MongoDB. Changes persist across restarts."}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Customers</h1>
          <p className="mt-1 text-sm text-muted">{total} total</p>
        </div>
        <Button asChild variant="accent" size="sm">
          <AdminLink href="/dashboard">New job</AdminLink>
        </Button>
      </div>

      <Suspense fallback={<div className="mt-4 h-11 animate-pulse rounded-2xl bg-white dark:bg-navy-800" />}>
        <AdminSearchBar placeholder="Search name or phone…" className="sm:max-w-lg" />
      </Suspense>

      <ul className="mt-4 space-y-2 md:hidden">
        {customers.map((c) => {
          const latest = c.repairs[0] ?? null;
          return (
            <li key={c.id}>
              <AdminLink
                href={`/customers/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
              >
                <div className="min-w-0">
                  <p className="font-medium text-navy dark:text-white">{highlightSequentialMatch(c.name, qDisplay)}</p>
                  <p className="text-sm text-muted">{highlightSequentialMatch(c.phone, qDisplay)}</p>
                  {c.location ? (
                    <p className="text-xs text-muted">{highlightSequentialMatch(c.location, qDisplay)}</p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted">{c._count.repairs} jobs</p>
                  {latest ? <JobStatusBadge status={latest.status} /> : null}
                </div>
              </AdminLink>
            </li>
          );
        })}
        {customers.length === 0 ? (
          <li className="rounded-2xl bg-white p-8 text-center text-sm text-muted dark:bg-navy-800">No customers.</li>
        ) : null}
      </ul>

      <div className="mt-6 hidden md:block">
        <DataTable columns={["Name", "Phone", "Location", "Jobs", "Latest", ""]} empty={customers.length === 0}>
          {customers.map((c) => {
            const latest = c.repairs[0] ?? null;
            return (
              <tr key={c.id} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-navy dark:text-white">
                  <AdminLink href={`/customers/${c.id}`} className="hover:text-accent">
                    {highlightSequentialMatch(c.name, qDisplay)}
                  </AdminLink>
                </td>
                <td className="px-4 py-3 text-muted">{highlightSequentialMatch(c.phone, qDisplay)}</td>
                <td className="px-4 py-3 text-muted">
                  {c.location ? highlightSequentialMatch(c.location, qDisplay) : "N/A"}
                </td>
                <td className="px-4 py-3 text-muted">{c._count.repairs}</td>
                <td className="px-4 py-3">
                  {latest ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs">{highlightSequentialMatch(latest.jobId, qDisplay)}</span>
                      <JobStatusBadge status={latest.status} />
                    </div>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminLink href={`/customers/${c.id}`} className="text-sm text-accent">
                    Open
                  </AdminLink>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/customers"
        query={{ q: searchParams.q, location: searchParams.location }}
      />
    </div>
  );
}
