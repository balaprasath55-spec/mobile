import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-white p-5 soft-shadow dark:bg-navy-800", className)}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-navy dark:text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
