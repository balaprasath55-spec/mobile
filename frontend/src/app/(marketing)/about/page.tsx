import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "About MR Mobile Zone Service, Chennai — our story, team, and how to visit, call, or WhatsApp us in George Town.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "2016", text: "Opened as a specialist iPhone repair desk in George Town, Chennai." },
  { year: "2019", text: "Expanded to board-level and water damage recovery." },
  { year: "2021", text: "Launched all-India courier repair with photo documentation." },
  { year: "2024", text: "Crossed 146k Instagram followers and 11k+ customer records." },
];

const team = [
  {
    title: "Board specialist",
    desc: "Microsoldering, power IC, and water damage recovery.",
    image: "/about/board-specialist.jpg",
    alt: "Board specialist at microscope doing microsoldering",
  },
  {
    title: "Apple & Android lead",
    desc: "Display, battery, Face ID, and flagship Android repairs.",
    image: "/about/apple-android-lead.jpg",
    alt: "Apple and Android lead technician at the workshop counter",
  },
  {
    title: "Customer success",
    desc: "Status updates, courier coordination, and clear handovers.",
    image: "/about/customer-success.jpg",
    alt: "MR Mobile Zone team at CEC India industry event",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeading
          title="Built for people who care about their devices"
          subtitle="MR Mobile Zone Service is a Chennai workshop known for careful diagnostics, honest quotes, and specialist Apple & flagship Android work."
        />
        <div className="prose prose-navy max-w-3xl text-muted dark:prose-invert">
          <p>
            We started with a simple idea: phone repair should feel as considered as the products themselves.
            No rushed counters, no hidden fees. Just skilled technicians, clean benches, and clear communication.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <figure className="overflow-hidden rounded-2xl soft-shadow">
            <div className="relative aspect-[3/4] max-h-[520px] w-full">
              <Image
                src="/about/founder.jpg"
                alt="Founder of MR Mobile Zone Service"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </figure>
          <div>
            <SectionHeading
              title="Meet the founder"
              subtitle="The hands behind MR Mobile Zone — from a single repair desk in George Town to a workshop trusted across Chennai and beyond."
            />
            <div className="prose prose-navy max-w-none text-muted dark:prose-invert">
              <p>
                What started as a passion for fixing phones the right way grew into a full specialist workshop.
                Every device that comes through our doors gets the same care — honest diagnostics, clear quotes,
                and repairs done with the right tools and training.
              </p>
              <p>
                Today, MR Mobile Zone is known for board-level work, Apple specialist repairs, and an all-India
                courier workflow — but the goal has never changed: treat every customer&apos;s phone like it&apos;s our own.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <SectionHeading title="Milestones" />
        <ol className="grid gap-4 md:grid-cols-2">
          {milestones.map((m) => (
            <li key={m.year} className="rounded-2xl bg-white p-6 soft-shadow dark:bg-navy-800">
              <p className="text-sm font-semibold text-accent">{m.year}</p>
              <p className="mt-2 text-navy dark:text-white">{m.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          title="Team & certifications"
          subtitle="Microsoldering-trained technicians, ESD protocols, and continuous parts quality audits."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((role) => (
            <figure key={role.title} className="overflow-hidden rounded-2xl border border-navy/5 dark:border-white/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={role.image}
                  alt={role.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="p-6">
                <p className="font-display font-semibold text-navy dark:text-white">{role.title}</p>
                <p className="mt-2 text-sm text-muted">{role.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="contact" className="scroll-mt-20 border-t border-navy/5 dark:border-white/10">
        <SectionHeading title="Contact us" subtitle={SITE.addressShort} />
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
                  <li
                    key={h.day}
                    className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
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
              title="MR Mobile Zone map, George Town, Chennai"
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
    </>
  );
}
