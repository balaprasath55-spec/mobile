"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { listLocalCustomers, listLocalRepairs } from "@/lib/demo-local";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";

/** Shows jobs saved in this browser (Amplify demo persistence). */
export function LocalRecentJobs({ limit = 6 }: { limit?: number }) {
  const [rows, setRows] = useState<{ repair: DemoRepair; customer?: DemoCustomer }[]>([]);

  useEffect(() => {
    const repairs = listLocalRepairs();
    const customers = listLocalCustomers();
    setRows(
      repairs.slice(0, limit).map((repair) => ({
        repair,
        customer: customers.find((c) => c.id === repair.customerId),
      }))
    );
  }, [limit]);

  if (rows.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-navy dark:text-white">Your saved jobs (this device)</h2>
      <ul className="space-y-2">
        {rows.map(({ repair, customer }) => (
          <li key={repair.id}>
            <Link
              href={`/repairs/${repair.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 soft-shadow active:bg-surface dark:bg-navy-800"
            >
              {repair.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={repair.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-navy dark:text-white">{repair.issue}</p>
                <p className="truncate text-xs text-muted">
                  {customer?.name} · {customer?.phone} · {format(new Date(repair.createdAt), "dd MMM")}
                </p>
              </div>
              <JobStatusBadge status={repair.status} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
