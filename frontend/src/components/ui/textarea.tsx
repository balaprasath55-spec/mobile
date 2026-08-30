import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/10 dark:bg-navy-800 dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
