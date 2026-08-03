import type { Metadata } from "next";
import { format } from "date-fns";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { EnquiryActions } from "@/components/admin/enquiry-actions";
import { Button } from "@/components/ui/button";
import { getStore, type DemoEnquiryStatus } from "@/lib/demo-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries" };

const statuses: DemoEnquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export default async function EnquiriesAdminPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = searchParams.status as DemoEnquiryStatus | undefined;
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = 20;
  const store = getStore();

  let rows = [...store.enquiries];
  if (status && statuses.includes(status)) {
    rows = rows.filter((e) => e.status === status);
  }
  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const enquiries = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div>
        <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">Inbox</h1>
        <p className="mt-1 text-sm text-muted">Website enquiries · {total}</p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Button asChild size="sm" variant={!status ? "default" : "outline"} className="shrink-0">
          <a href="/enquiries">All</a>
        </Button>
        {statuses.map((s) => (
          <Button key={s} asChild size="sm" variant={status === s ? "default" : "outline"} className="shrink-0">
            <a href={`/enquiries?status=${s}`}>{s}</a>
          </Button>
        ))}
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {enquiries.map((e) => (
          <li key={e.id} className="rounded-2xl bg-white p-3 soft-shadow dark:bg-navy-800">
            <div className="flex gap-3">
              {e.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-navy dark:text-white">{e.name}</p>
                  <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] dark:bg-navy-900">
                    {e.status}
                  </span>
                </div>
                <a href={`tel:${e.phone}`} className="text-sm text-accent">
                  {e.phone}
                </a>
                <p className="mt-1 text-sm text-navy dark:text-white">{e.issue || "—"}</p>
                <p className="text-xs text-muted">
                  {e.device || "Device n/a"} · {format(e.createdAt, "dd MMM HH:mm")}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <EnquiryActions id={e.id} status={e.status} />
            </div>
          </li>
        ))}
        {enquiries.length === 0 ? (
          <li className="rounded-2xl bg-white p-8 text-center text-sm text-muted dark:bg-navy-800">No enquiries.</li>
        ) : null}
      </ul>

      <div className="mt-6 hidden md:block">
        <DataTable
          columns={["When", "Name", "Phone", "Device / Issue", "Status", "Actions"]}
          empty={enquiries.length === 0}
        >
          {enquiries.map((e) => (
            <tr key={e.id} className="border-t border-navy/5 dark:border-white/10">
              <td className="px-4 py-3 text-xs text-muted">{format(e.createdAt, "dd MMM HH:mm")}</td>
              <td className="px-4 py-3 font-medium text-navy dark:text-white">{e.name}</td>
              <td className="px-4 py-3 text-muted">{e.phone}</td>
              <td className="px-4 py-3 text-sm text-muted">
                <p>{e.device || "—"}</p>
                <p className="text-navy dark:text-white">{e.issue || e.message || "—"}</p>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs dark:bg-navy-900">{e.status}</span>
              </td>
              <td className="px-4 py-3">
                <EnquiryActions id={e.id} status={e.status} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
      <Pagination page={page} totalPages={totalPages} basePath="/enquiries" query={{ status }} />
    </div>
  );
}
