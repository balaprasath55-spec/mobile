"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Input } from "@/components/ui/input";
import { faqs, services } from "@/lib/content";

const index = [
  ...services.map((s) => ({ title: s.title, href: `/services/${s.slug}`, blurb: s.summary, type: "Service" })),
  { title: "Price estimator", href: "/pricing", blurb: "Get a repair price range", type: "Page" },
  { title: "Courier repair", href: "/courier", blurb: "All-India shipping repair", type: "Page" },
  { title: "Contact", href: "/contact", blurb: "Call, WhatsApp, visit", type: "Page" },
  ...faqs.flatMap((g) =>
    g.items.map((item) => ({ title: item.q, href: "/faq", blurb: item.a, type: "FAQ" }))
  ),
];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const fuse = useMemo(() => new Fuse(index, { keys: ["title", "blurb", "type"], threshold: 0.4 }), []);
  const results = q.trim() ? fuse.search(q).map((r) => r.item) : index.slice(0, 8);

  return (
    <Section>
      <SectionHeading title="Search" subtitle="Find services, pages, and FAQs." />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try display, courier, pricing…"
        className="max-w-xl"
        autoFocus
      />
      <ul className="mt-8 max-w-2xl space-y-3">
        {results.map((r) => (
          <li key={`${r.href}-${r.title}`}>
            <Link href={r.href} className="block rounded-2xl border border-navy/5 p-4 hover:border-accent/30 dark:border-white/10">
              <p className="text-xs uppercase tracking-wide text-accent">{r.type}</p>
              <p className="mt-1 font-medium text-navy dark:text-white">{r.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{r.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
