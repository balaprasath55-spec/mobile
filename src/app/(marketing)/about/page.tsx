import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind MR Mobile Zone Service — Chennai's premium mobile repair workshop.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "2016", text: "Opened as a specialist iPhone repair desk in George Town, Chennai." },
  { year: "2019", text: "Expanded to board-level and water damage recovery." },
  { year: "2021", text: "Launched all-India courier repair with photo documentation." },
  { year: "2024", text: "Crossed 146k Instagram followers and 11k+ customer records." },
];

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
            No rushed counters, no hidden fees — just skilled technicians, clean benches, and clear communication.
          </p>
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
        <div className="grid gap-4 sm:grid-cols-3">
          {["Lead technician", "Board specialist", "Customer success"].map((role) => (
            <div key={role} className="rounded-2xl border border-navy/5 p-6 dark:border-white/10">
              <div className="mb-4 h-24 rounded-2xl bg-gradient-to-br from-navy-100 to-accent/20 dark:from-navy-700" />
              <p className="font-display font-semibold text-navy dark:text-white">{role}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
