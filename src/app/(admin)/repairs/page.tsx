import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/auth";
import { getStore, type DemoRepairStatus } from "@/lib/demo-store";
import { REPAIR_STATUS_FLOW, REPAIR_STATUS_LABELS } from "@/lib/repairs";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Repairs" };

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const q = searchParams.q?.trim().toLowerCase() ?? "";
  const status = searchParams.status as DemoRepairStatus | undefined;
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 20;
  const store = getStore();

  let rows = [...store.repairs];
  if (status && REPAIR_STATUS_FLOW.includes(status)) {
    rows = rows.filter((r) => r.status === status);
  }
  if (q) {
    rows = rows.filter((r) => {
      const customer = store.customers.find((c) => c.id === r.customerId);
      return (
        r.jobId.toLowerCase().includes(q) ||
        (r.imei ?? "").includes(q) ||
        r.issue.toLowerCase().includes(q) ||
        (customer?.name.toLowerCase().includes(q) ?? false) ||
        (customer?.phone.includes(q) ?? false)
      );
    });
  }

  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const repairs = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Jobs</h1>
          <p className="mt-1 text-sm text-muted">{total} total</p>
        </div>
        <Button asChild variant="accent" className="hidden md:inline-flex">
          <Link href="/repairs/new">New job</Link>
        </Button>
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Input name="q" placeholder="Search…" defaultValue={searchParams.q ?? ""} className="h-11 flex-1 text-base sm:max-w-sm" />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-11 rounded-2xl border border-navy/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-navy-800"
        >
          <option value="">All statuses</option>
          {REPAIR_STATUS_FLOW.map((s) => (
            <option key={s} value={s}>
              {REPAIR_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" className="h-11">
          Filter
        </Button>
      </form>

      <ul className="mt-4 space-y-2 md:hidden">
        {repairs.map((r) => {
          const customer = store.customers.find((c) => c.id === r.customerId)!;
          return (
            <li key={r.id}>
              <Link
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
                  <p className="truncate font-medium text-navy dark:text-white">{r.issue}</p>
                  <p className="truncate text-xs text-muted">
                    {customer.name} · {customer.phone}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{r.jobId}</p>
                </div>
                <JobStatusBadge status={r.status} />
              </Link>
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
            const customer = store.customers.find((c) => c.id === r.customerId)!;
            return (
              <tr key={r.id} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 font-mono text-xs">{r.jobId}</td>
                <td className="px-4 py-3">
                  <Link href={`/customers/${customer.id}`} className="font-medium text-navy hover:text-accent dark:text-white">
                    {customer.name}
                  </Link>
                  <p className="text-xs text-muted">{customer.phone}</p>
                </td>
                <td className="px-4 py-3 text-muted">{r.issue}</td>
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
      </div>
      <Pagination page={page} totalPages={totalPages} basePath="/repairs" query={{ q: searchParams.q, status }} />
    </div>
  );
}
