import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { IPHONE_DISPLAYS, displayWhatsAppUrl, displaysWhatsAppUrl } from "@/lib/displays";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "iPhone Displays",
  description:
    "Buy iPhone removed displays with sensor flex. Order on WhatsApp — no online payment. MR Mobile Zone, Chennai.",
  alternates: { canonical: "/displays" },
};

export default function DisplaysPage() {
  return (
    <Section>
      <SectionHeading
        title="iPhone removed displays"
        subtitle="Original-quality removed displays with sensor flex. Tap Order on WhatsApp — we confirm stock and take it from there. No online payment on this site."
      />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          With sensor flex
        </span>
        <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-muted dark:bg-white/10">
          {IPHONE_DISPLAYS.length} models listed
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IPHONE_DISPLAYS.map((item) => (
          <li
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white soft-shadow dark:border-white/10 dark:bg-navy-800"
          >
            <div className="relative aspect-[4/3] bg-surface dark:bg-navy-900">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="font-display text-lg font-semibold text-navy dark:text-white">{item.model}</p>
              <p className="mt-1 text-xs text-muted">Removed display · sensor flex included</p>
              <p className="mt-3 font-display text-2xl font-semibold text-accent">{formatINR(item.price)}</p>
              <Button asChild variant="accent" size="sm" className="mt-4 w-full min-h-11">
                <a href={displayWhatsAppUrl(item)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-navy/5 bg-surface/80 p-6 text-center dark:border-white/10 dark:bg-navy-900/50">
        <p className="text-sm text-muted">
          Not sure which model? Message us on WhatsApp with your iPhone model number or a photo of Settings →
          General → About.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4 min-h-11">
          <a href={displaysWhatsAppUrl()} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    </Section>
  );
}
