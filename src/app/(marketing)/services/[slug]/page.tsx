import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/marketing/section";
import { BeforeAfterSlider } from "@/components/marketing/before-after";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content";
import { SITE } from "@/lib/utils";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "LocalBusiness", name: SITE.name },
    areaServed: "IN",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Service</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy dark:text-white md:text-5xl">
          {service.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{service.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="accent">
            <Link href="/enquiry">Book this repair</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Get estimate</Link>
          </Button>
        </div>
        <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl bg-surface p-4 dark:bg-navy-800">
            <dt className="text-muted">Turnaround</dt>
            <dd className="mt-1 font-semibold text-navy dark:text-white">{service.turnaround}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-4 dark:bg-navy-800">
            <dt className="text-muted">Warranty</dt>
            <dd className="mt-1 font-semibold text-navy dark:text-white">{service.warranty}</dd>
          </div>
        </dl>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <SectionHeading title="Process" subtitle="Diagnosis → quote → repair → quality check → delivery." />
        <BeforeAfterSlider beforeLabel="" afterLabel="" />
      </Section>

      <Section>
        <SectionHeading title="Warranty terms" />
        <p className="max-w-2xl text-muted">
          Parts and workmanship are covered for the stated period. Physical damage, liquid ingress after repair,
          and software issues unrelated to the job are excluded. Keep your warranty card.
        </p>
        <div className="mt-10">
          <SectionHeading title="FAQ" />
          <Accordion type="single" collapsible className="max-w-2xl">
            <AccordionItem value="1">
              <AccordionTrigger>Do you keep my old part?</AccordionTrigger>
              <AccordionContent>On request we can return replaced parts after inspection.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger>Will original features still work?</AccordionTrigger>
              <AccordionContent>
                We prioritise feature retention (Face ID, True Tone, wireless charging) and tell you upfront if a
                parts choice affects them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 p-3 backdrop-blur md:hidden dark:border-white/10 dark:bg-navy-900/95">
        <Button asChild className="w-full" variant="accent">
          <Link href="/enquiry">Book {service.title}</Link>
        </Button>
      </div>
    </>
  );
}
