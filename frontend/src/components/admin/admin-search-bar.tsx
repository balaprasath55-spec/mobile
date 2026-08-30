"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type SelectField = {
  name: string;
  options: { value: string; label: string }[];
};

export function AdminSearchBar({
  placeholder = "Search…",
  searchKey = "q",
  selects = [],
  className,
}: {
  placeholder?: string;
  searchKey?: string;
  selects?: SelectField[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get(searchKey) ?? "");

  useEffect(() => {
    setQ(searchParams.get(searchKey) ?? "");
  }, [searchParams, searchKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = q.trim();
      if (trimmed) params.set(searchKey, trimmed);
      else params.delete(searchKey);
      params.delete("page");

      const next = params.toString();
      const current = searchParams.toString();
      if (next !== current) {
        router.replace(next ? `${pathname}?${next}` : pathname);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [q, pathname, router, searchKey, searchParams]);

  function onSelectChange(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }

  return (
    <div className={`mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap ${className ?? ""}`}>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`h-11 flex-1 text-base sm:max-w-md ${
          q.trim()
            ? "border-amber-400/70 ring-2 ring-amber-300/40 dark:border-amber-500/50 dark:ring-amber-500/25"
            : ""
        }`}
        autoComplete="off"
        autoFocus
      />
      {selects.map((field) => (
        <select
          key={field.name}
          value={searchParams.get(field.name) ?? ""}
          onChange={(e) => onSelectChange(field.name, e.target.value)}
          className="h-11 rounded-2xl border border-navy/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-navy-800"
        >
          {field.options.map((opt) => (
            <option key={opt.value || "__all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
