import Link from "next/link";
import { cn } from "@/lib/utils";

export function DataTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/5 bg-white dark:border-white/10 dark:bg-navy-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-navy/5 bg-surface text-muted dark:border-white/10 dark:bg-navy-900">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{empty ? null : children}</tbody>
      </table>
      {empty ? <p className="px-4 py-10 text-center text-sm text-muted">No records found.</p> : null}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-muted">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={href(Math.max(1, page - 1))}
          className={cn(
            "rounded-full border border-navy/10 px-3 py-1.5 dark:border-white/10",
            page <= 1 && "pointer-events-none opacity-40"
          )}
        >
          Prev
        </Link>
        <Link
          href={href(Math.min(totalPages, page + 1))}
          className={cn(
            "rounded-full border border-navy/10 px-3 py-1.5 dark:border-white/10",
            page >= totalPages && "pointer-events-none opacity-40"
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
