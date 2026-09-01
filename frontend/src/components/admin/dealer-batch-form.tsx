"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { RepairIntakeToggles } from "@/components/admin/repair-intake-toggles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import { DEFAULT_REPAIR_INTAKE, type RepairIntakeChecks } from "@/lib/repair-intake";
import { cn } from "@/lib/utils";

type DeviceRow = {
  key: string;
  deviceBrandRaw: string;
  deviceModelRaw: string;
  issue: string;
  imei: string;
  intakeChecks: RepairIntakeChecks;
};

function emptyRow(): DeviceRow {
  return {
    key: Math.random().toString(36).slice(2, 9),
    deviceBrandRaw: "",
    deviceModelRaw: "",
    issue: "",
    imei: "",
    intakeChecks: { ...DEFAULT_REPAIR_INTAKE },
  };
}

function defaultRows(count: number): DeviceRow[] {
  return Array.from({ length: count }, () => emptyRow());
}

export function DealerBatchForm({ dealerId, dealerName }: { dealerId: string; dealerName: string }) {
  const router = useRouter();
  const [rows, setRows] = useState<DeviceRow[]>(() => defaultRows(10));
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filledCount = useMemo(
    () => rows.filter((r) => r.deviceModelRaw.trim() && r.issue.trim()).length,
    [rows]
  );

  function updateRow(key: string, patch: Partial<DeviceRow>) {
    setRows((current) => current.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function toggleExpanded(key: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function removeRow(key: string) {
    setRows((r) => r.filter((x) => x.key !== key));
    setExpanded((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const devices = rows
      .filter((r) => r.deviceModelRaw.trim() && r.issue.trim())
      .map((r) => ({
        deviceBrandRaw: r.deviceBrandRaw.trim(),
        deviceModelRaw: r.deviceModelRaw.trim(),
        issue: r.issue.trim(),
        imei: r.imei.trim(),
        intakeChecks: r.intakeChecks,
      }));

    if (devices.length === 0) {
      setError("Fill in at least one row with model and issue");
      return;
    }
    if (devices.length > 20) {
      setError("Maximum 20 devices per batch");
      return;
    }

    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await apiFetch(`/api/dealers/${dealerId}/batches`, {
      method: "POST",
      json: {
        notes: String(fd.get("notes") ?? "").trim(),
        devices,
      },
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not save batch");
      return;
    }
    const data = await res.json();
    router.push(`/dealers/${dealerId}?batch=${data.batch.batchRef}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-2xl gap-4">
      <p className="text-sm text-muted">
        Bulk intake for <span className="font-medium text-navy dark:text-white">{dealerName}</span> — add up to 20
        mobiles in one go ({filledCount} ready). Each phone has its own intake checklist.
      </p>

      <Textarea name="notes" placeholder="Batch notes (optional) — applies to all jobs" rows={2} className="text-base" />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-navy dark:text-white">Devices</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={rows.length >= 20}
            onClick={() => setRows((r) => [...r, emptyRow()])}
          >
            <Plus className="mr-1 h-4 w-4" /> Add row
          </Button>
        </div>

        <ul className="space-y-2">
          {rows.map((row, idx) => {
            const isOpen = expanded.has(row.key);
            const label = row.deviceModelRaw.trim() || `Phone ${idx + 1}`;
            return (
              <li
                key={row.key}
                className="rounded-2xl border border-navy/10 bg-white p-3 dark:border-white/10 dark:bg-navy-800"
              >
                <div className="grid gap-2 sm:grid-cols-[auto_1fr_1fr_1fr_auto]">
                  <span className="flex h-10 w-8 items-center justify-center text-xs font-medium text-muted sm:h-auto">
                    {idx + 1}
                  </span>
                  <Input
                    placeholder="Brand"
                    value={row.deviceBrandRaw}
                    onChange={(e) => updateRow(row.key, { deviceBrandRaw: e.target.value })}
                    className="h-11 text-base"
                  />
                  <Input
                    placeholder="Model *"
                    value={row.deviceModelRaw}
                    onChange={(e) => updateRow(row.key, { deviceModelRaw: e.target.value })}
                    className="h-11 text-base"
                  />
                  <Input
                    placeholder="Issue *"
                    value={row.issue}
                    onChange={(e) => updateRow(row.key, { issue: e.target.value })}
                    className="h-11 text-base"
                  />
                  <div className="flex gap-2 sm:col-span-4 sm:pl-10">
                    <Input
                      placeholder="IMEI (optional)"
                      value={row.imei}
                      onChange={(e) => updateRow(row.key, { imei: e.target.value })}
                      className="h-11 flex-1 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      disabled={rows.length <= 1}
                      onClick={() => removeRow(row.key)}
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpanded(row.key)}
                  className="mt-2 flex w-full items-center justify-between gap-2 rounded-xl border border-navy/10 px-3 py-2 text-left text-sm font-medium text-navy transition hover:bg-navy/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  <span>Intake checklist — {label}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 transition", isOpen && "rotate-180")} />
                </button>

                {isOpen ? (
                  <RepairIntakeToggles
                    value={row.intakeChecks}
                    onChange={(intakeChecks) => updateRow(row.key, { intakeChecks })}
                    className="mt-2 border-0 bg-navy/[0.03] p-3 dark:bg-white/[0.03]"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" variant="accent" disabled={loading || filledCount === 0} className="h-12 w-full text-base">
        {loading ? "Creating jobs…" : `Save batch (${filledCount} job${filledCount === 1 ? "" : "s"})`}
      </Button>
    </form>
  );
}
