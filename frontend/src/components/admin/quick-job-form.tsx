"use client";

import { apiUrl } from "@/lib/api-client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, ImagePlus } from "lucide-react";
import { BrandModelSelect } from "@/components/admin/brand-model-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileToDataUrl } from "@/lib/image-data-url";

type Props = {
  defaults?: {
    name?: string;
    phone?: string;
    issue?: string;
    device?: string;
    brand?: string;
  };
};

function formatApiError(data: unknown): string {
  if (!data || typeof data !== "object") return "Could not save";
  const err = (data as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "fieldErrors" in err) {
    const fields = (err as { fieldErrors: Record<string, string[] | undefined> }).fieldErrors;
    const first = Object.values(fields).flat().find(Boolean);
    if (first) return first;
  }
  return "Could not save";
}

export function QuickJobForm({ defaults }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onFileChange(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload a photo of the device / issue");
      return;
    }

    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const imageUrl = await fileToDataUrl(file, 960, 0.6);
      const amountRaw = fd.get("amount");
      const amount = amountRaw === null || amountRaw === "" ? null : Number(amountRaw);

      const payload = {
        name: String(fd.get("name") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim(),
        issue: String(fd.get("issue") ?? "").trim(),
        imageUrl,
        modelId: String(fd.get("modelId") ?? "") || null,
        deviceBrandRaw: String(fd.get("deviceBrandRaw") ?? ""),
        deviceModelRaw: String(fd.get("deviceModelRaw") ?? ""),
        location: String(fd.get("location") ?? ""),
        amount: Number.isFinite(amount as number) ? amount : null,
        notes: String(fd.get("notes") ?? ""),
      };

      const res = await fetch(apiUrl("/api/jobs/quick"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(formatApiError(data));

      router.push(`/repairs/${data.repair.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-lg gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Customer name <span className="text-red-500">*</span>
        </span>
        <Input
          name="name"
          required
          autoComplete="name"
          enterKeyHint="next"
          placeholder="e.g. Ramesh"
          defaultValue={defaults?.name ?? ""}
          className="h-12 text-base"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Phone <span className="text-red-500">*</span>
        </span>
        <Input
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="10-digit mobile"
          defaultValue={defaults?.phone ?? ""}
          className="h-12 text-base"
        />
      </label>

      <BrandModelSelect defaultBrandName={defaults?.brand} defaultModelName={defaults?.device} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Issue <span className="text-red-500">*</span>
        </span>
        <Textarea
          name="issue"
          required
          rows={3}
          placeholder="e.g. Display cracked, no touch"
          defaultValue={defaults?.issue ?? ""}
          className="min-h-[88px] text-base"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Photo <span className="text-red-500">*</span>
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy/15 bg-white px-4 py-6 text-sm text-muted transition hover:border-accent/40 dark:border-white/15 dark:bg-navy-800"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Camera className="h-6 w-6" />
              </span>
              <span className="font-medium text-navy dark:text-white">Tap to take / upload photo</span>
              <span className="text-xs">JPG, PNG · max 5MB</span>
            </>
          )}
          {preview ? (
            <span className="mt-2 inline-flex items-center gap-1 text-accent">
              <ImagePlus className="h-4 w-4" /> Change photo
            </span>
          ) : null}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center justify-center gap-1 py-2 text-sm text-muted"
      >
        {showMore ? "Hide" : "More options"} (optional)
        <ChevronDown className={`h-4 w-4 transition ${showMore ? "rotate-180" : ""}`} />
      </button>

      {showMore ? (
        <div className="grid gap-3 rounded-2xl bg-white p-4 dark:bg-navy-800">
          <Input name="location" placeholder="Area / location (optional)" className="h-12 text-base" />
          <Input
            name="amount"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="Amount ₹ (optional)"
            className="h-12 text-base"
          />
          <Textarea name="notes" placeholder="Notes (optional)" className="text-base" />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" variant="accent" size="lg" disabled={loading} className="h-12 w-full text-base">
        {loading ? "Saving…" : "Save job"}
      </Button>
    </form>
  );
}
