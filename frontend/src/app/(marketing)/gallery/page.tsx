"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BeforeAfterSlider } from "@/components/marketing/before-after";
import { Section, SectionHeading } from "@/components/marketing/section";
import { galleryItems } from "@/lib/content";

const categories = ["All", "Shop", "Display", "Battery", "Back glass", "Board"] as const;

export default function GalleryPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (cat === "All" ? galleryItems : galleryItems.filter((i) => i.category === cat)),
    [cat]
  );

  return (
    <Section>
      <SectionHeading
        title="Repair gallery"
        subtitle="Workshop photos and repair work from MR Mobile Zone, George Town."
      />
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm ${
              cat === c ? "bg-navy text-white dark:bg-white dark:text-navy" : "bg-surface text-muted dark:bg-navy-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl border border-navy/5 soft-shadow dark:border-white/10">
            <div className="relative aspect-[4/3]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            </div>
            <figcaption className="px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-accent">{item.category}</p>
              <p className="mt-1 font-medium text-navy dark:text-white">{item.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-12">
        <SectionHeading title="Before & after" subtitle="Drag to compare a typical display repair." />
        <div className="mx-auto max-w-3xl">
          <BeforeAfterSlider beforeLabel="" afterLabel="" />
        </div>
      </div>
    </Section>
  );
}
