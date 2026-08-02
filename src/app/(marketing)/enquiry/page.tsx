"use client";

import { FormEvent, Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, ChevronDown, ImagePlus } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function EnquiryForm() {
  const params = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  function onFileChange(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (!file) {
      setStatus("error");
      setMessage("Please upload a photo of the device / issue.");
      return;
    }

    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      const uploadRes = await fetch("/api/uploads", { method: "POST", body: uploadFd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const payload = {
        name: String(fd.get("name") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim(),
        issue: String(fd.get("issue") ?? "").trim(),
        imageUrl: uploadData.url as string,
        device: String(fd.get("device") ?? "").trim() || undefined,
        location: String(fd.get("location") ?? "").trim() || undefined,
        message: String(fd.get("message") ?? "").trim() || undefined,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "failed");
      }

      setStatus("ok");
      setMessage("Thanks — we’ll contact you shortly.");
      form.reset();
      onFileChange(null);
      setShowMore(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not submit. Try WhatsApp.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-lg gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Your name <span className="text-red-500">*</span>
        </span>
        <Input name="name" required autoComplete="name" enterKeyHint="next" placeholder="e.g. Ramesh" className="h-12 text-base" />
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
          className="h-12 text-base"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy dark:text-white">
          Issue <span className="text-red-500">*</span>
        </span>
        <Textarea
          name="issue"
          required
          rows={3}
          placeholder="e.g. Display cracked, no touch"
          defaultValue={params.get("issue") ?? ""}
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
        <div className="grid gap-3 rounded-2xl bg-surface p-4 dark:bg-navy-800">
          <Input
            name="device"
            placeholder="Device model (optional)"
            defaultValue={params.get("device") ?? ""}
            className="h-12 text-base"
          />
          <Input name="location" placeholder="Area / location (optional)" className="h-12 text-base" />
          <Textarea name="message" placeholder="Extra message (optional)" className="text-base" />
        </div>
      ) : null}

      <Button type="submit" variant="accent" size="lg" disabled={status === "loading"} className="h-12 w-full text-base">
        {status === "loading" ? "Sending…" : "Submit enquiry"}
      </Button>

      {message ? (
        <p className={`text-center text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`}>{message}</p>
      ) : null}
    </form>
  );
}

export default function EnquiryPage() {
  return (
    <Section className="py-10 md:py-16">
      <SectionHeading
        title="Repair enquiry"
        subtitle="Name, phone, issue & photo are enough — we typically reply within a few hours."
        align="center"
      />
      <Suspense fallback={<div className="mx-auto h-64 max-w-lg animate-pulse rounded-2xl bg-surface" />}>
        <EnquiryForm />
      </Suspense>
    </Section>
  );
}
