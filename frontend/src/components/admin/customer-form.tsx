"use client";

import { apiFetch } from "@/lib/api-client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRefreshAdminData } from "@/lib/use-refresh-admin-data";

type CustomerFormValues = {
  name: string;
  phone: string;
  altPhone?: string | null;
  address?: string | null;
  location?: string | null;
};

export function CustomerForm({
  initial,
  customerId,
}: {
  initial?: CustomerFormValues;
  customerId?: string;
}) {
  const router = useRouter();
  const refreshData = useRefreshAdminData();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      altPhone: String(fd.get("altPhone") ?? ""),
      address: String(fd.get("address") ?? ""),
      location: String(fd.get("location") ?? ""),
    };

    const res = await apiFetch(customerId ? `/api/customers/${customerId}` : "/api/customers", {
      method: customerId ? "PUT" : "POST",
      json: payload,
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Could not save customer");
      return;
    }

    const data = await res.json();
    if (customerId) {
      setSaved(true);
      refreshData();
      return;
    }
    router.push(`/customers/${data.customer.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-4">
      <Input name="name" placeholder="Full name" required defaultValue={initial?.name ?? ""} />
      <Input name="phone" placeholder="Phone" required defaultValue={initial?.phone ?? ""} />
      <Input name="altPhone" placeholder="Alt phone" defaultValue={initial?.altPhone ?? ""} />
      <Input name="location" placeholder="Location / area" defaultValue={initial?.location ?? ""} />
      <Textarea name="address" placeholder="Address" defaultValue={initial?.address ?? ""} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-600">Saved</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? "Saving…" : customerId ? "Update customer" : "Create customer"}
      </Button>
    </form>
  );
}
