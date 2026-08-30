import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, MapPin } from "lucide-react";
import { AnimatedHero } from "@/components/marketing/animated-hero";
import { BeforeAfterSlider } from "@/components/marketing/before-after";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { FeatureBlock } from "@/components/marketing/feature-block";
import { ProcessTracker } from "@/components/marketing/process-tracker";
import { Reveal } from "@/components/marketing/reveal";
import { ReviewCarousel } from "@/components/marketing/review-carousel";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ServiceCardGrid } from "@/components/marketing/service-card";
import { StatsCounter } from "@/components/marketing/stats-counter";
import { YoutubeVideoGrid } from "@/components/marketing/youtube-videos";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Mobile & Tablet Repair in Chennai",
  description:
    "MR Mobile Zone Service: trusted display, battery, back glass and motherboard repairs with all-India courier support.",
  alternates: { canonical: "/" },
};

async function getRepairCountDisplay() {
  try {
    const data = await serverApi<{ count: number }>("/api/stats/repair-count");
    return Math.max(data.count, 18500);
  } catch {
    return 18500;
  }
}

const reasons = [
  "ESD-safe workbenches & calibrated tools",
  "Transparent pricing before any repair",
  "Same-day turnaround for common repairs",
  "Pan-India courier with photo documentation",
  "146k+ community that trusts our work",
];

export default async function HomePage() {
  const devicesRepaired = await getRepairCountDisplay();

  return (
    <>
      <AnimatedHero />

      <Section className="!pt-10 !pb-8 bg-white dark:bg-navy-900">
        <BrandMarquee />
      </Section>

      <Section className="!pt-4">
        <Reveal>
          <StatsCounter
            devicesRepaired={devicesRepaired}
            instagram={SITE.instagramFollowers}
            youtube={SITE.youtubeSubscribers}
            customers={SITE.customersServed}
          />
        </Reveal>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <Reveal>
          <SectionHeading
            title="Get the best service for your phone"
            subtitle="Specialist work for iPhone, Android, tablets and more, with genuine-quality parts and clear timelines."
            align="center"
          />
        </Reveal>
        <ServiceCardGrid />
        <Reveal className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/services">View all services</Link>
          </Button>
        </Reveal>
      </Section>

      <Section>
        <div className="space-y-20 md:space-y-28">
          <FeatureBlock
            eyebrow="iPhone specialist"
            title="iPhone repair & service"
            body="Screen replacement, battery, Face ID, charging port and camera work with colour calibration and feature retention where supported."
            href="/services/iphone-ipad"
            cta="Explore iPhone repairs"
            image="/features/iphone.jpg"
            imageAlt="iPhone repair on a professional workshop bench"
            caption="Face ID · True Tone · Same-day screens"
          />
          <FeatureBlock
            eyebrow="Board-level"
            title="Motherboard & water damage"
            body="Ultrasonic cleaning and microsoldering for devices other shops write off. Photo documentation at every stage."
            href="/services/motherboard-water-damage"
            cta="Recover your device"
            reverse
            image="/features/board.jpg"
            imageAlt="Smartphone motherboard microsoldering repair"
            caption="Microsoldering · Ultrasonic cleaning"
          />
          <FeatureBlock
            eyebrow="Pan-India"
            title="Courier repair from anywhere"
            body="Ship securely from any city. We diagnose, repair, and return with tracking, typically in 3–7 days end to end."
            href="/courier"
            cta="Start courier repair"
            image="/features/courier.jpg"
            imageAlt="Securely packed phone ready for courier shipping"
            caption="Tracked · Insured · 3–7 day turnaround"
          />
        </div>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <Reveal>
          <SectionHeading
            title="How repair works here"
            subtitle="A calm, documented process from walk-in to handover."
            align="center"
          />
        </Reveal>
        <ProcessTracker />
      </Section>

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <SectionHeading
              title="Why customers stay with us"
              subtitle="Technical depth without the chaos. You always know the status and the price."
            />
            <ul className="space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-navy dark:text-white/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {r}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <Link href="/why-us">Compare us</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfterSlider beforeLabel="" afterLabel="" />
          </Reveal>
        </div>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              title="Loved by our community"
              subtitle={`${SITE.rating}★ from ${SITE.reviewCount}+ public ratings.`}
            />
            <Button asChild variant="outline">
              <Link href="/testimonials">All reviews</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ReviewCarousel />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading title="From the workshop" subtitle="Repair photos from display, battery, board work and the shop floor." />
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { src: "/gallery/display.jpg", alt: "Display repair" },
            { src: "/gallery/battery.jpg", alt: "Battery repair" },
            { src: "/gallery/backglass.jpg", alt: "Back glass repair" },
            { src: "/gallery/shop.jpg", alt: "Workshop" },
          ].map((img, i) => (
            <Reveal key={img.src} delay={i * 0.05}>
              <Link href="/gallery" className="group relative block aspect-square overflow-hidden rounded-2xl soft-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/gallery">View gallery</Link>
          </Button>
        </Reveal>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <Reveal>
          <SectionHeading
            title="Watch our work"
            subtitle="Repair videos from our YouTube channel. Tap a thumbnail to watch on YouTube."
          />
        </Reveal>
        <YoutubeVideoGrid limit={6} />
      </Section>

      <Section className="bg-navy text-white overflow-hidden relative">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Not in Chennai?</h2>
            <p className="mt-3 max-w-md text-white/70">
              Our all-India courier repair service brings workshop-grade diagnostics to your doorstep,
              with tracked, insured, documented shipping.
            </p>
            <Button asChild className="mt-6 bg-white text-navy hover:bg-white/90" variant="secondary">
              <Link href="/courier">Start courier repair</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-white/60">Typical turnaround</p>
              <p className="mt-2 font-display text-4xl font-semibold">3–7 days</p>
              <p className="mt-2 text-sm text-white/60">Including transit · Pan-India coverage</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-navy p-8 text-white md:p-12">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 animate-blob rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative font-display text-3xl font-semibold md:text-4xl">
              Ready when your device isn&apos;t.
            </h2>
            <p className="relative mt-3 max-w-xl text-white/80">
              Walk in, book online, or ship it. Same specialists either way.
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-white text-navy hover:bg-white/90">
                <Link href="/enquiry">Submit enquiry</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-navy/5 soft-shadow dark:border-white/10">
          <div className="flex items-start gap-2 border-b border-navy/5 bg-surface px-4 py-3 text-sm text-muted dark:border-white/10 dark:bg-navy-800">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 break-words hover:text-accent"
            >
              <span className="sm:hidden">{SITE.addressShort}</span>
              <span className="hidden sm:inline">{SITE.address}</span>
            </a>
          </div>
          <iframe
            title="MR Mobile Zone location"
            className="h-72 w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            src={SITE.mapEmbedUrl}
          />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
