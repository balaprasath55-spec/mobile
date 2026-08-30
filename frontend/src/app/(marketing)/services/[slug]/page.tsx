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
      <div className="pb-28 md:pb-0">
        <Section>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Service</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy dark:text-white sm:text-4xl md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{service.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="accent" className="w-full sm:w-auto">
              <Link href="/enquiry">Book this repair</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/pricing">Get estimate</Link>
            </Button>
          </div>
          <dl className="mt-8 grid max-w-xs gap-3 text-sm sm:gap-4">
            <div className="rounded-2xl bg-surface p-4 dark:bg-navy-800">
              <dt className="text-muted">Turnaround</dt>
              <dd className="mt-1 font-semibold text-navy dark:text-white">{service.turnaround}</dd>
            </div>
          </dl>
        </Section>

        <Section className="bg-surface dark:bg-navy-900/50">
          <SectionHeading title="Process" subtitle="Diagnosis, quote, repair, quality check, then delivery." />
          <BeforeAfterSlider beforeLabel="" afterLabel="" />
        </Section>

        <Section>
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
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 p-3 pr-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-white/10 dark:bg-navy-900/95">
        <Button asChild className="h-12 w-full text-base" variant="accent">
          <Link href="/enquiry">Book {service.title}</Link>
        </Button>
      </div>
    </>
  );
}
