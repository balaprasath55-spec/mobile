"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteConfirmButtonProps = {
  url: string;
  confirmMessage: string;
  label?: string;
  successRedirect?: string;
  variant?: "ghost" | "outline" | "accent";
  className?: string;
  onSuccess?: () => void;
};

export function DeleteConfirmButton({
  url,
  confirmMessage,
  label = "Delete",
  successRedirect,
  variant = "outline",
  className,
  onSuccess,
}: DeleteConfirmButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    setError("");
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not delete");
      return;
    }

    if (onSuccess) {
      onSuccess();
      return;
    }
    if (successRedirect) {
      router.push(successRedirect);
    }
    router.refresh();
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Button
        type="button"
        size="sm"
        variant={variant}
        disabled={loading}
        onClick={handleClick}
        className={cn(variant === "outline" && "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30")}
      >
        {loading ? "Deleting…" : label}
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
