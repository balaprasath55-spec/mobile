"use client";

import { useRouter } from "next/navigation";
import { startTransition, useCallback } from "react";

/**
 * Soft-reloads server-rendered admin data in the background (no full page reload).
 * Use after successful create/update/delete mutations.
 */
export function useRefreshAdminData() {
  const router = useRouter();

  return useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);
}
