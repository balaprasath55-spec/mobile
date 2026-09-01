"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { apiFetch, apiUrl } from "@/lib/api-client";
import type { DemoAttendance, DemoAttendanceStatus, DemoEmployee } from "@/lib/demo-store";
import { useRefreshAdminData } from "@/lib/use-refresh-admin-data";
import { Button } from "@/components/ui/button";

const STATUSES: { value: DemoAttendanceStatus; label: string }[] = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "HALF_DAY", label: "Half day" },
  { value: "LEAVE", label: "Leave" },
];

type RowState = {
  employeeId: string;
  status: DemoAttendanceStatus;
  notes: string;
};

function monthStart(iso: string) {
  return `${iso.slice(0, 7)}-01`;
}

export function AttendanceForm({
  date,
  employees,
  records,
}: {
  date: string;
  employees: DemoEmployee[];
  records: DemoAttendance[];
}) {
  const router = useRouter();
  const refreshData = useRefreshAdminData();
  const initial = useMemo(() => {
    const byEmp = new Map(records.map((r) => [r.employeeId, r]));
    return employees.map((e): RowState => {
      const existing = byEmp.get(e.id);
      return {
        employeeId: e.id,
        status: existing?.status ?? "PRESENT",
        notes: existing?.notes ?? "",
      };
    });
  }, [employees, records]);

  const [selectedDate, setSelectedDate] = useState(date);
  const [rows, setRows] = useState<RowState[]>(initial);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportFrom, setExportFrom] = useState(monthStart(date));
  const [exportTo, setExportTo] = useState(date);
  const [exportError, setExportError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateRow(employeeId: string, patch: Partial<RowState>) {
    setRows((prev) => prev.map((r) => (r.employeeId === employeeId ? { ...r, ...patch } : r)));
  }

  function onDateChange(next: string) {
    setSelectedDate(next);
    router.push(`/attendance?date=${encodeURIComponent(next)}`);
  }

  function openExport() {
    setExportFrom(monthStart(selectedDate));
    setExportTo(selectedDate);
    setExportError(null);
    setShowExport(true);
  }

  async function exportCsv() {
    if (exportFrom > exportTo) {
      setExportError("From date must be on or before to date.");
      return;
    }
    setExporting(true);
    setExportError(null);
    try {
      const qs = new URLSearchParams({ from: exportFrom, to: exportTo });
      const res = await fetch(apiUrl(`/api/attendance/export?${qs.toString()}`));
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setExportError(data?.error || "Could not export attendance.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${exportFrom}-to-${exportTo}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExport(false);
    } finally {
      setExporting(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await apiFetch("/api/attendance", {
        method: "PUT",
        json: {
          date: selectedDate,
          records: rows.map((r) => ({
            employeeId: r.employeeId,
            status: r.status,
            notes: r.notes.trim() || null,
          })),
        },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Could not save attendance.");
        return;
      }
      setMessage("Attendance saved.");
      refreshData();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block text-sm">
          <span className="text-muted">Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-navy dark:border-white/10 dark:bg-navy-800 dark:text-white sm:w-48"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={exporting}
            onClick={openExport}
            className="min-h-11"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button type="button" variant="accent" disabled={saving} onClick={save} className="min-h-11">
            {saving ? "Saving…" : "Save attendance"}
          </Button>
        </div>
      </div>

      {message ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {showExport ? (
        <div className="rounded-2xl border border-navy/10 bg-white p-4 soft-shadow dark:border-white/10 dark:bg-navy-800">
          <p className="font-medium text-navy dark:text-white">Export attendance</p>
          <p className="mt-1 text-sm text-muted">Choose a date range to download saved records as CSV.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted">From</span>
              <input
                type="date"
                value={exportFrom}
                onChange={(e) => setExportFrom(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-navy dark:border-white/10 dark:bg-navy-900 dark:text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">To</span>
              <input
                type="date"
                value={exportTo}
                onChange={(e) => setExportTo(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-navy dark:border-white/10 dark:bg-navy-900 dark:text-white"
              />
            </label>
          </div>
          {exportError ? <p className="mt-3 text-sm text-red-600">{exportError}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="accent" disabled={exporting} onClick={exportCsv} className="min-h-11">
              {exporting ? "Downloading…" : "Download CSV"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={exporting}
              onClick={() => setShowExport(false)}
              className="min-h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3 md:hidden">
        {employees.map((emp) => {
          const row = rows.find((r) => r.employeeId === emp.id)!;
          return (
            <li key={emp.id} className="rounded-2xl bg-white p-3 soft-shadow dark:bg-navy-800">
              <p className="font-medium text-navy dark:text-white">{emp.name}</p>
              <p className="text-xs text-muted">
                {emp.role} · {emp.phone}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updateRow(emp.id, { status: s.value })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      row.status === s.value
                        ? "bg-navy text-white dark:bg-white dark:text-navy"
                        : "bg-surface text-muted dark:bg-navy-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={row.notes}
                onChange={(e) => updateRow(emp.id, { notes: e.target.value })}
                className="mt-3 w-full rounded-xl border border-navy/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
              />
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl bg-white soft-shadow md:block dark:bg-navy-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface/80 text-xs uppercase tracking-wide text-muted dark:bg-navy-900">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const row = rows.find((r) => r.employeeId === emp.id)!;
              return (
                <tr key={emp.id} className="border-t border-navy/5 dark:border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy dark:text-white">{emp.name}</p>
                    <p className="text-xs text-muted">{emp.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{emp.role}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        updateRow(emp.id, { status: e.target.value as DemoAttendanceStatus })
                      }
                      className="rounded-xl border border-navy/10 bg-transparent px-3 py-2 dark:border-white/10"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Optional"
                      value={row.notes}
                      onChange={(e) => updateRow(emp.id, { notes: e.target.value })}
                      className="w-full max-w-xs rounded-xl border border-navy/10 bg-transparent px-3 py-2 dark:border-white/10"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
