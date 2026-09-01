import type { Metadata } from "next";
import { AdminLink } from "@/components/admin/admin-link";
import { format } from "date-fns";
import { Phone, ClipboardList, Inbox } from "lucide-react";
import { DashboardQuickSearch } from "@/components/admin/dashboard-quick-search";
import { QuickJobForm } from "@/components/admin/quick-job-form";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { DEMO_LOGIN } from "@/lib/demo-auth";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";
import { fetchCatalogBrands, serverApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { name?: string; phone?: string; issue?: string; device?: string; brand?: string };
}) {
  const [{ pending, newEnquiries, customerCount, recentWithCustomers }, brands] = await Promise.all([
    serverApi<{
      pending: number;
      newEnquiries: number;
      customerCount: number;
      recentWithCustomers: { repair: DemoRepair; customer: DemoCustomer | null }[];
    }>("/api/dashboard"),
    fetchCatalogBrands(),
  ]);
  const recent = recentWithCustomers.map((r) => r.repair);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
          Hi, {DEMO_LOGIN.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">Quick intake for walk-ins — name, phone, issue &amp; photo</p>
      </div>

      <DashboardQuickSearch />

      <QuickJobForm
        brands={brands}
        defaults={{
          name: searchParams.name,
          phone: searchParams.phone,
          issue: searchParams.issue,
          device: searchParams.device,
          brand: searchParams.brand,
        }}
      />

      <div className="grid grid-cols-3 gap-2">
        <AdminLink
          href="/repairs"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <ClipboardList className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">{pending}</p>
          <p className="text-[11px] text-muted">Pending</p>
        </AdminLink>
        <AdminLink
          href="/enquiries"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <Inbox className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">{newEnquiries}</p>
          <p className="text-[11px] text-muted">New inbox</p>
        </AdminLink>
        <AdminLink
          href="/customers"
          className="rounded-2xl bg-white p-3 text-center soft-shadow dark:bg-navy-800"
        >
          <Phone className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1 font-display text-xl font-semibold text-navy dark:text-white">{customerCount}</p>
          <p className="text-[11px] text-muted">Customers</p>
        </AdminLink>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy dark:text-white">Recent jobs</h2>
          <Button asChild size="sm" variant="ghost">
            <AdminLink href="/repairs">See all</AdminLink>
          </Button>
        </div>
        <ul className="space-y-2">
          {recentWithCustomers.map(({ repair: r, customer }) => (
            <li key={r.id}>
              <AdminLink
                href={`/repairs/${r.id}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
              >
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy dark:text-white">{r.issue}</p>
                  <p className="truncate text-xs text-muted">
                    {customer?.name} · {customer?.phone} · {format(r.createdAt, "dd MMM")}
                  </p>
                </div>
                <JobStatusBadge status={r.status} />
              </AdminLink>
            </li>
          ))}
          {recent.length === 0 ? (
            <li className="rounded-2xl bg-white p-6 text-center text-sm text-muted dark:bg-navy-800">
              No jobs yet. Use the form above to create one.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
