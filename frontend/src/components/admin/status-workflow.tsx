"use client";

import { apiUrl } from "@/lib/api-client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { updateLocalRepairStatus } from "@/lib/demo-local";
import { REPAIR_STATUS_FLOW, REPAIR_STATUS_LABELS } from "@/lib/repairs";
import type { DemoRepairStatus } from "@/lib/demo-store";

export function StatusWorkflow({
  repairId,
  status,
  local = false,
}: {
  repairId: string;
  status: DemoRepairStatus;
  local?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(status);
  const idx = REPAIR_STATUS_FLOW.indexOf(current);
  const next = idx >= 0 && idx < REPAIR_STATUS_FLOW.length - 1 ? REPAIR_STATUS_FLOW[idx + 1] : null;

  async function setStatus(nextStatus: DemoRepairStatus) {
    setLoading(true);
    setError("");

    if (local) {
      const updated = updateLocalRepairStatus(repairId, nextStatus);
      setLoading(false);
      if (!updated) {
        setError("Could not update status");
        return;
      }
      setCurrent(nextStatus);
      return;
    }

    const res = await fetch(apiUrl(`/api/repairs/${repairId}/status`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not update status");
      return;
    }
    setCurrent(nextStatus);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-navy/5 bg-white p-4 md:p-5 dark:border-white/10 dark:bg-navy-800">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted">Current status</p>
        <JobStatusBadge status={current} />
      </div>
      <ol className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {REPAIR_STATUS_FLOW.map((s) => (
          <li key={s} className="shrink-0">
            <button
              type="button"
              disabled={loading || s === current}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-2 text-xs ${
                s === current
                  ? "bg-navy text-white dark:bg-white dark:text-navy"
                  : "bg-surface text-muted hover:bg-navy/5 dark:bg-navy-900"
              }`}
            >
              {REPAIR_STATUS_LABELS[s]}
            </button>
          </li>
        ))}
      </ol>
      {next ? (
        <Button className="mt-4 h-12 w-full text-base md:w-auto" variant="accent" disabled={loading} onClick={() => setStatus(next)}>
          Advance to {REPAIR_STATUS_LABELS[next]}
        </Button>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
