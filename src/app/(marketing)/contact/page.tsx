import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit our George Town, Chennai workshop, call, or WhatsApp MR Mobile Zone Service.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section>
      <SectionHeading title="Contact us" subtitle={SITE.address} />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-start gap-3 text-sm text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="min-w-0 break-words">{SITE.address}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="accent" className="w-full sm:w-auto">
              <a href={`tel:${SITE.phone}`}>
                <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/enquiry">Send an enquiry</Link>
            </Button>
          </div>
          <p className="break-all text-sm text-muted">{SITE.email}</p>

          <div className="rounded-2xl border border-navy/5 p-5 dark:border-white/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy dark:text-white">
              <Clock className="h-4 w-4 text-accent" />
              Opening hours
            </div>
            <ul className="space-y-2.5 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-muted">{h.day}</span>
                  <span
                    className={
                      h.time === "Closed"
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "font-medium text-navy dark:text-white sm:text-right"
                    }
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <iframe
            title="MR Mobile Zone map — George Town, Chennai"
            className="h-72 w-full rounded-2xl soft-shadow sm:h-80 md:h-full md:min-h-[360px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            src={SITE.mapEmbedUrl}
          />
          <p className="mt-3 text-center text-xs text-muted md:text-left">
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              Open in Google Maps
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
