import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Phone, ClipboardList, Inbox } from "lucide-react";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { LocalRecentJobs } from "@/components/admin/local-recent-jobs";
import { Button } from "@/components/ui/button";
import { DEMO_LOGIN } from "@/lib/demo-auth";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const store = getStore();
  const pending = store.repairs.filter((r) =>
    ["RECEIVED", "DIAGNOSED", "IN_REPAIR", "QUALITY_CHECK", "READY_FOR_DELIVERY"].includes(r.status)
  ).length;
  const newEnquiries = store.enquiries.filter((e) => e.status === "NEW").length;
  const recent = [...store.repairs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
          Hi, {DEMO_LOGIN.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">Quick intake for walk-ins</p>
      </div>

      <Link
        href="/repairs/new"
        className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 text-base font-semibold text-white shadow-soft active:scale-[0.99]"
      >
        <Plus className="h-5 w-5" />
        New job
      </Link>

      <div className="grid grid-cols-3 gap-2">
        <Link
          href="/repairs"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <ClipboardList className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">{pending}</p>
          <p className="text-[11px] text-muted">Pending</p>
        </Link>
        <Link
          href="/enquiries"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <Inbox className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">{newEnquiries}</p>
          <p className="text-[11px] text-muted">New inbox</p>
        </Link>
        <Link
          href="/customers"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <Phone className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">
            {store.customers.length}
          </p>
          <p className="text-[11px] text-muted">Customers</p>
        </Link>
      </div>

      <LocalRecentJobs />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy dark:text-white">Sample jobs</h2>
          <Button asChild size="sm" variant="ghost">
            <Link href="/repairs">See all</Link>
          </Button>
        </div>
        <ul className="space-y-2">
          {recent.map((r) => {
            const customer = store.customers.find((c) => c.id === r.customerId);
            return (
              <li key={r.id}>
                <Link
                  href={`/repairs/${r.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-navy dark:text-white">{r.issue}</p>
                    <p className="truncate text-xs text-muted">
                      {customer?.name} · {customer?.phone} · {format(r.createdAt, "dd MMM")}
                    </p>
                  </div>
                  <JobStatusBadge status={r.status} />
                </Link>
              </li>
            );
          })}
          {recent.length === 0 ? (
            <li className="rounded-2xl bg-white p-6 text-center text-sm text-muted dark:bg-navy-800">
              No jobs yet. Tap <strong>New job</strong> to start.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
