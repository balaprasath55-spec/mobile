"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export function Switch({ checked, onCheckedChange, id, disabled, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      disabled={disabled}
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50",
        checked
          ? "border-sky-300/50 bg-sky-400"
          : "border-red-900/40 bg-red-950/90 dark:bg-red-950"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
          checked ? "left-[1.35rem]" : "left-0.5"
        )}
      />
    </button>
  );
}
