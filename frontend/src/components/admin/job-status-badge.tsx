import { cn } from "@/lib/utils";

export function JobStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    RECEIVED: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    DIAGNOSED: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
    IN_REPAIR: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    QUALITY_CHECK: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    READY_FOR_DELIVERY: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    CLOSED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-[9rem] shrink-0 truncate rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:max-w-none sm:text-xs",
        styles[status] ?? styles.CLOSED
      )}
      title={status.replaceAll("_", " ")}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
