import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind MR Mobile Zone Service, Chennai's premium mobile repair workshop.",
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
        <SectionHeading title="Team & certifications" subtitle="Microsoldering-trained technicians, ESD protocols, and continuous parts quality audits." />
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
    </>
  );
}
