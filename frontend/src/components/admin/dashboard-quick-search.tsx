"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AdminLink } from "@/components/admin/admin-link";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";
import type { DemoRepairStatus } from "@/lib/demo-store";
import { highlightSequentialMatch } from "@/lib/search-utils";

type QuickJob = {
  id: string;
  jobId: string;
  issue: string;
  status: DemoRepairStatus;
  customer: { id: string; name: string; phone: string };
};

type QuickCustomer = {
  id: string;
  name: string;
  phone: string;
  location: string | null;
};

export function DashboardQuickSearch() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<QuickJob[]>([]);
  const [customers, setCustomers] = useState<QuickCustomer[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const trimmed = q.trim();
  const showResults = open && trimmed.length >= 2;

  useEffect(() => {
    if (trimmed.length < 2) {
      setJobs([]);
      setCustomers([]);
      setTotalJobs(0);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: trimmed, pageSize: "6", page: "1" });
        const [repairsRes, customersRes] = await Promise.all([
          apiFetch(`/api/repairs?${params}`, { signal: controller.signal }),
          apiFetch(`/api/customers?${params}`, { signal: controller.signal }),
        ]);

        if (!repairsRes.ok) throw new Error("Search failed");

        const repairsData = (await repairsRes.json()) as {
          repairs: QuickJob[];
          pagination: { total: number };
        };
        setJobs(repairsData.repairs);
        setTotalJobs(repairsData.pagination.total);

        if (customersRes.ok) {
          const customersData = (await customersRes.json()) as { customers: QuickCustomer[] };
          setCustomers(customersData.customers.slice(0, 4));
        } else {
          setCustomers([]);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setJobs([]);
          setCustomers([]);
          setTotalJobs(0);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const hasResults = jobs.length > 0 || customers.length > 0;

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Quick search — job ID, name, phone, issue…"
          className={`h-12 pl-10 text-base ${
            trimmed
              ? "border-amber-400/70 ring-2 ring-amber-300/40 dark:border-amber-500/50 dark:ring-amber-500/25"
              : ""
          }`}
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      {showResults ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-lg dark:border-white/10 dark:bg-navy-800">
          {loading ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : !hasResults ? (
            <p className="px-4 py-3 text-sm text-muted">No jobs or customers found.</p>
          ) : (
            <div className="max-h-[min(70vh,24rem)] overflow-y-auto">
              {jobs.length > 0 ? (
                <section>
                  <p className="border-b border-navy/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted dark:border-white/5">
                    Jobs
                  </p>
                  <ul>
                    {jobs.map((job) => (
                      <li key={job.id}>
                        <AdminLink
                          href={`/repairs/${job.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface dark:hover:bg-navy-900"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-navy dark:text-white">
                              {highlightSequentialMatch(job.issue, trimmed)}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {highlightSequentialMatch(job.customer.name, trimmed)} ·{" "}
                              {highlightSequentialMatch(job.customer.phone, trimmed)}
                            </p>
                            <p className="mt-0.5 font-mono text-[11px] text-muted">
                              {highlightSequentialMatch(job.jobId, trimmed)}
                            </p>
                          </div>
                          <JobStatusBadge status={job.status} />
                        </AdminLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {customers.length > 0 ? (
                <section>
                  <p className="border-b border-t border-navy/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted dark:border-white/5">
                    Customers
                  </p>
                  <ul>
                    {customers.map((customer) => (
                      <li key={customer.id}>
                        <AdminLink
                          href={`/customers/${customer.id}`}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 transition hover:bg-surface dark:hover:bg-navy-900"
                        >
                          <p className="truncate text-sm font-medium text-navy dark:text-white">
                            {highlightSequentialMatch(customer.name, trimmed)}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {highlightSequentialMatch(customer.phone, trimmed)}
                            {customer.location ? ` · ${customer.location}` : ""}
                          </p>
                        </AdminLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}

          {totalJobs > jobs.length ? (
            <AdminLink
              href={`/repairs?q=${encodeURIComponent(trimmed)}`}
              onClick={() => setOpen(false)}
              className="block border-t border-navy/5 px-4 py-3 text-center text-sm font-medium text-accent dark:border-white/5"
            >
              View all {totalJobs} job matches
            </AdminLink>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
