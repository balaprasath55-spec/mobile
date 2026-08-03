import Link from "next/link";
import type { Metadata } from "next";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string; location?: string; page?: string };
}) {
  const q = searchParams.q?.trim().toLowerCase() ?? "";
  const location = searchParams.location?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 20;
  const store = getStore();

  let rows = [...store.customers];
  if (q) {
    rows = rows.filter((c) => {
      const repairs = store.repairs.filter((r) => r.customerId === c.id);
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.location ?? "").toLowerCase().includes(q) ||
        repairs.some((r) => r.jobId.toLowerCase().includes(q) || (r.imei ?? "").includes(q))
      );
    });
  }
  if (location) {
    rows = rows.filter((c) => (c.location ?? "").toLowerCase().includes(location));
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const customers = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="mb-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
        Demo mode — data resets when the server restarts.
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Customers</h1>
          <p className="mt-1 text-sm text-muted">{total} total</p>
        </div>
        <Button asChild variant="accent" size="sm">
          <Link href="/repairs/new">New job</Link>
        </Button>
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input name="q" placeholder="Search name or phone…" defaultValue={searchParams.q ?? ""} className="h-11 flex-1 text-base" />
        <Button type="submit" variant="outline" className="h-11">
          Search
        </Button>
      </form>

      <ul className="mt-4 space-y-2 md:hidden">
        {customers.map((c) => {
          const repairs = store.repairs
            .filter((r) => r.customerId === c.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          const latest = repairs[0];
          return (
            <li key={c.id}>
              <Link
                href={`/customers/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
              >
                <div className="min-w-0">
                  <p className="font-medium text-navy dark:text-white">{c.name}</p>
                  <p className="text-sm text-muted">{c.phone}</p>
                  {c.location ? <p className="text-xs text-muted">{c.location}</p> : null}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted">{repairs.length} jobs</p>
                  {latest ? <JobStatusBadge status={latest.status} /> : null}
                </div>
              </Link>
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
            const repairs = store.repairs
              .filter((r) => r.customerId === c.id)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            const latest = repairs[0];
            return (
              <tr key={c.id} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-navy dark:text-white">
                  <Link href={`/customers/${c.id}`} className="hover:text-accent">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{c.phone}</td>
                <td className="px-4 py-3 text-muted">{c.location ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{repairs.length}</td>
                <td className="px-4 py-3">
                  {latest ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs">{latest.jobId}</span>
                      <JobStatusBadge status={latest.status} />
                    </div>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/customers/${c.id}`} className="text-sm text-accent">
                    Open
                  </Link>
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
