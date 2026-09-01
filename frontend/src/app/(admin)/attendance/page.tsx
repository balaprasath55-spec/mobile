import type { Metadata } from "next";
import { AttendanceForm } from "@/components/admin/attendance-form";
import type { DemoAttendance, DemoEmployee } from "@/lib/demo-store";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Attendance" };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const date =
    searchParams.date && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date)
      ? searchParams.date
      : todayIso();

  const data = await serverApi<{
    date: string;
    employees: DemoEmployee[];
    records: DemoAttendance[];
  }>(`/api/attendance?date=${encodeURIComponent(date)}`);

  return (
    <div>
      <div>
        <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
          Attendance
        </h1>
        <p className="mt-1 text-sm text-muted">
          Mark daily attendance for {data.employees.length} staff · {date}
        </p>
      </div>
      <div className="mt-6">
        <AttendanceForm date={data.date} employees={data.employees} records={data.records} />
      </div>
    </div>
  );
}
