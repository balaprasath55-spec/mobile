import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLink } from "@/components/admin/admin-link";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { Button } from "@/components/ui/button";
import type { DemoDealer } from "@/lib/demo-store";
import { highlightSequentialMatch } from "@/lib/search-utils";
import { serverApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Dealers" };

type DealerRow = DemoDealer & { pendingJobs: number; batchCount: number };

export default async function DealersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const qDisplay = searchParams.q?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const qs = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (qDisplay) qs.set("q", qDisplay);

  const data = await serverApi<{
    dealers: DealerRow[];
    pagination: { total: number; totalPages: number };
  }>(`/api/dealers?${qs}`);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Dealers</h1>
          <p className="mt-1 text-sm text-muted">{data.pagination.total} dealers · bulk job intake</p>
        </div>
        <Button asChild variant="accent">
          <AdminLink href="/dealers/new">Add dealer</AdminLink>
        </Button>
      </div>

      <Suspense fallback={<div className="mt-4 h-11 animate-pulse rounded-2xl bg-white dark:bg-navy-800" />}>
        <AdminSearchBar placeholder="Search dealer, shop, phone…" />
      </Suspense>

      <ul className="mt-4 space-y-2">
        {data.dealers.map((d) => (
          <li key={d.id}>
            <AdminLink
              href={`/dealers/${d.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 soft-shadow active:bg-surface dark:bg-navy-800"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-navy dark:text-white">
                  {highlightSequentialMatch(d.shopName, qDisplay)}
                </p>
                <p className="truncate text-sm text-muted">
                  {highlightSequentialMatch(d.name, qDisplay)} · {highlightSequentialMatch(d.phone, qDisplay)}
                </p>
                {d.location ? <p className="truncate text-xs text-muted">{d.location}</p> : null}
              </div>
              <div className="shrink-0 text-right text-xs">
                <p className="font-semibold text-navy dark:text-white">{d.pendingJobs} pending</p>
                <p className="text-muted">{d.batchCount} batches</p>
              </div>
            </AdminLink>
          </li>
        ))}
        {data.dealers.length === 0 ? (
          <li className="rounded-2xl bg-white p-8 text-center text-sm text-muted dark:bg-navy-800">
            No dealers yet.{" "}
            <AdminLink href="/dealers/new" className="text-accent">
              Add your first dealer
            </AdminLink>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
