import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { socialLinks, testimonials } from "@/lib/content";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Customer reviews for MR Mobile Zone Service — 4.4 rating from hundreds of Chennai customers.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <Section>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title="Customer reviews"
          subtitle="Based on public ratings for M R Mobile Zone Services, Seven Wells / Broadway, Chennai."
        />
        <div className="rounded-2xl bg-surface px-4 py-3 text-sm dark:bg-navy-800">
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(SITE.rating) ? "fill-current" : ""}`} />
            ))}
          </div>
          <p className="mt-1 font-semibold text-navy dark:text-white">
            {SITE.rating} · {SITE.reviewCount}+ ratings
          </p>
          <p className="text-xs text-muted">Justdial / Google listings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <article key={`${t.name}-${t.location}`} className="rounded-2xl border border-navy/5 p-6 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted dark:bg-navy-900">
                {t.source}
              </span>
            </div>
            <p className="mt-4 text-navy dark:text-white">&ldquo;{t.text}&rdquo;</p>
            <p className="mt-4 text-sm text-muted">
              {t.name} · {t.location}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="accent">
          <a href={socialLinks.google} target="_blank" rel="noreferrer">
            View on Google
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
            Instagram repairs
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={socialLinks.youtube} target="_blank" rel="noreferrer">
            YouTube videos
          </a>
        </Button>
      </div>
    </Section>
  );
}
