"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandModelSelect } from "@/components/admin/brand-model-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RepairForm({
  customerId,
  initial,
  repairId,
  defaults,
}: {
  customerId: string;
  repairId?: string;
  initial?: {
    issue?: string;
    deviceBrandRaw?: string | null;
    deviceModelRaw?: string | null;
    modelId?: string | null;
    imei?: string | null;
    amount?: number | string | null;
    advancePaid?: number | string | null;
    warrantyDays?: number | null;
    notes?: string | null;
  };
  defaults?: {
    issue?: string;
    deviceModelRaw?: string;
    notes?: string;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerId,
      issue: String(fd.get("issue") ?? ""),
      modelId: String(fd.get("modelId") ?? "") || "",
      deviceBrandRaw: String(fd.get("deviceBrandRaw") ?? ""),
      deviceModelRaw: String(fd.get("deviceModelRaw") ?? ""),
      imei: String(fd.get("imei") ?? ""),
      amount: fd.get("amount") === "" ? null : Number(fd.get("amount")),
      advancePaid: fd.get("advancePaid") === "" ? 0 : Number(fd.get("advancePaid")),
      warrantyDays: fd.get("warrantyDays") === "" ? null : Number(fd.get("warrantyDays")),
      notes: String(fd.get("notes") ?? ""),
    };

    const res = await fetch(repairId ? `/api/repairs/${repairId}` : "/api/repairs", {
      method: repairId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not save repair job");
      return;
    }

    const data = await res.json();
    router.push(`/repairs/${data.repair.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-4">
      <Input
        name="issue"
        placeholder="Issue (e.g. Display cracked)"
        required
        defaultValue={initial?.issue ?? defaults?.issue ?? ""}
        className="h-12 text-base"
      />

      <BrandModelSelect
        defaultBrandName={initial?.deviceBrandRaw}
        defaultModelName={initial?.deviceModelRaw ?? defaults?.deviceModelRaw}
        defaultModelId={initial?.modelId ?? ""}
      />

      <Input name="imei" placeholder="IMEI" defaultValue={initial?.imei ?? ""} className="h-12 text-base" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          name="amount"
          type="number"
          min="0"
          step="1"
          placeholder="Amount (₹)"
          defaultValue={initial?.amount != null ? String(initial.amount) : ""}
          className="h-12 text-base"
        />
        <Input
          name="advancePaid"
          type="number"
          min="0"
          step="1"
          placeholder="Advance"
          defaultValue={initial?.advancePaid != null ? String(initial.advancePaid) : "0"}
          className="h-12 text-base"
        />
        <Input
          name="warrantyDays"
          type="number"
          min="0"
          placeholder="Warranty days"
          defaultValue={initial?.warrantyDays != null ? String(initial.warrantyDays) : ""}
          className="h-12 text-base"
        />
      </div>
      <Textarea name="notes" placeholder="Notes" defaultValue={initial?.notes ?? defaults?.notes ?? ""} className="text-base" />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading} className="h-12">
        {loading ? "Saving…" : repairId ? "Update job" : "Create job"}
      </Button>
    </form>
  );
}
