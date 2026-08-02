import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "All-India Courier Repair",
  description: "Ship your phone from anywhere in India for specialist repair in Chennai.",
  alternates: { canonical: "/courier" },
};

export default function CourierPage() {
  return (
    <>
      <Section>
        <SectionHeading
          title="Courier repair, pan-India"
          subtitle="Secure shipping, photo documentation, and workshop-grade repair — then tracked return."
        />
        <ol className="grid gap-4 md:grid-cols-5">
          {processSteps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-surface p-4 dark:bg-navy-800">
              <span className="text-xs font-semibold text-accent">0{i + 1}</span>
              <p className="mt-2 font-semibold text-navy dark:text-white">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="bg-surface dark:bg-navy-900/50">
        <SectionHeading title="Supported couriers" subtitle="DTDC, Blue Dart, Delhivery, India Post — use your preferred partner." />
        <div className="flex flex-wrap gap-3">
          {["DTDC", "Blue Dart", "Delhivery", "India Post"].map((c) => (
            <span key={c} className="rounded-full border border-navy/10 px-4 py-2 text-sm dark:border-white/10">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-6 text-muted">Typical end-to-end turnaround: <strong className="text-navy dark:text-white">3–7 business days</strong>.</p>
        <Button asChild className="mt-6" variant="accent">
          <Link href="/enquiry?issue=Courier%20repair">Start courier enquiry</Link>
        </Button>
      </Section>
    </>
  );
}
