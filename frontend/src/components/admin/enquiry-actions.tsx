"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { Button } from "@/components/ui/button";
import { useRefreshAdminData } from "@/lib/use-refresh-admin-data";

export function EnquiryActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const refreshData = useRefreshAdminData();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    const res = await apiFetch(`/api/enquiries/${id}`, {
      method: "PUT",
      json: { status: next },
    });
    setLoading(false);
    if (!res.ok) return;
    refreshData();
  }

  async function convert(createJob: boolean) {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, {
        method: "POST",
        json: { createJob },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.repair?.id) {
        router.push(`/repairs/${data.repair.id}`);
      } else if (data.customer?.id) {
        router.push(`/customers/${data.customer.id}`);
      } else {
        refreshData();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      {status === "NEW" ? (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => setStatus("CONTACTED")} className="min-h-10 flex-1 md:flex-none">
          Mark contacted
        </Button>
      ) : null}
      {status !== "CONVERTED" && status !== "CLOSED" ? (
        <Button size="sm" variant="accent" disabled={loading} onClick={() => convert(true)} className="min-h-10 flex-1 md:flex-none">
          Convert to job
        </Button>
      ) : null}
      {status !== "CLOSED" ? (
        <Button size="sm" variant="ghost" disabled={loading} onClick={() => setStatus("CLOSED")} className="min-h-10">
          Close
        </Button>
      ) : null}
      <DeleteConfirmButton
        url={`/api/enquiries/${id}`}
        confirmMessage="Delete this enquiry permanently? This cannot be undone."
        label="Delete"
        variant="ghost"
        className="min-h-10"
      />
    </div>
  );
}
