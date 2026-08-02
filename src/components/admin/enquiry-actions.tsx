"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EnquiryActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    await fetch(`/api/enquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  }

  async function convert(createJob: boolean) {
    setLoading(true);
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createJob }),
    });
    setLoading(false);
    if (!res.ok) return;
    const data = await res.json();
    if (data.repair?.id) {
      router.push(`/repairs/${data.repair.id}`);
    } else if (data.customer?.id) {
      router.push(`/customers/${data.customer.id}`);
    } else {
      router.refresh();
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
    </div>
  );
}
