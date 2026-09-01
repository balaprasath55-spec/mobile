import { cn } from "@/lib/utils";
import { normalizeRepairStatus, repairStatusLabel } from "@/lib/repairs";

export function JobStatusBadge({ status }: { status: string }) {
  const normalized = normalizeRepairStatus(status);
  const styles: Record<string, string> = {
    RECEIVED: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    IN_REPAIR: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-[9rem] shrink-0 truncate rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:max-w-none sm:text-xs",
        styles[normalized] ?? styles.RECEIVED
      )}
      title={repairStatusLabel(status)}
    >
      {repairStatusLabel(status)}
    </span>
  );
}
