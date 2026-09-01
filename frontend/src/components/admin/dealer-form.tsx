"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";

export function DealerForm({
  dealerId,
  initial,
}: {
  dealerId?: string;
  initial?: {
    name?: string;
    shopName?: string;
    phone?: string;
    location?: string | null;
    notes?: string | null;
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
      name: String(fd.get("name") ?? "").trim(),
      shopName: String(fd.get("shopName") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      location: String(fd.get("location") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
    };

    const res = await apiFetch(dealerId ? `/api/dealers/${dealerId}` : "/api/dealers", {
      method: dealerId ? "PUT" : "POST",
      json: payload,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not save dealer");
      return;
    }
    const data = await res.json();
    router.push(`/dealers/${data.dealer.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-lg gap-4">
      <Input name="name" placeholder="Contact person name" required defaultValue={initial?.name ?? ""} className="h-12 text-base" />
      <Input name="shopName" placeholder="Shop / business name" required defaultValue={initial?.shopName ?? ""} className="h-12 text-base" />
      <Input name="phone" type="tel" placeholder="Phone" required defaultValue={initial?.phone ?? ""} className="h-12 text-base" />
      <Input name="location" placeholder="Area / location (optional)" defaultValue={initial?.location ?? ""} className="h-12 text-base" />
      <Textarea name="notes" placeholder="Notes (optional)" defaultValue={initial?.notes ?? ""} className="text-base" />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading} className="h-12">
        {loading ? "Saving…" : dealerId ? "Update dealer" : "Add dealer"}
      </Button>
    </form>
  );
}
