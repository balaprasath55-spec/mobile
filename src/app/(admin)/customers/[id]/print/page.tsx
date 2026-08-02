import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { PrintButton } from "@/components/admin/print-button";
import { authOptions } from "@/lib/auth";
import { getStore } from "@/lib/demo-store";
import { SITE, formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Print receipt", robots: { index: false } };

export default async function PrintReceiptPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { jobId?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const store = getStore();
  const customer = store.customers.find((c) => c.id === params.id);
  if (!customer) notFound();

  const repairs = store.repairs
    .filter((r) => r.customerId === customer.id)
    .filter((r) => (searchParams.jobId ? r.id === searchParams.jobId : true))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, searchParams.jobId ? 1 : 5);

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-ink print:p-0">
      <div className="mb-6 flex items-start justify-between border-b border-navy/10 pb-4">
        <div>
          <p className="font-display text-xl font-semibold">{SITE.shortName}</p>
          <p className="mt-1 text-xs text-muted">{SITE.address}</p>
          <p className="text-xs text-muted">{SITE.phone}</p>
        </div>
        <PrintButton />
      </div>

      <h1 className="font-display text-lg font-semibold">Customer receipt</h1>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted">Name</dt>
          <dd className="font-medium">{customer.name}</dd>
        </div>
        <div>
          <dt className="text-muted">Phone</dt>
          <dd className="font-medium">{customer.phone}</dd>
        </div>
        <div>
          <dt className="text-muted">Location</dt>
          <dd>{customer.location ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Printed</dt>
          <dd>{format(new Date(), "dd MMM yyyy HH:mm")}</dd>
        </div>
      </dl>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10 text-muted">
            <th className="py-2 font-medium">Job</th>
            <th className="py-2 font-medium">Issue</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((r) => (
            <tr key={r.id} className="border-b border-navy/5">
              <td className="py-2 font-mono text-xs">{r.jobId}</td>
              <td className="py-2">{r.issue}</td>
              <td className="py-2">{r.status.replaceAll("_", " ")}</td>
              <td className="py-2 text-right">{r.amount != null ? formatINR(r.amount) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-muted">
        Demo receipt · Warranty as noted on job card. Thank you for choosing {SITE.name}.
      </p>
    </div>
  );
}
