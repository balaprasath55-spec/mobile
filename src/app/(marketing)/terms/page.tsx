import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Section>
      <SectionHeading title="Terms of Service" subtitle={`Service terms for ${SITE.name}.`} />
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
        <p>Estimates are indicative until diagnosis is complete. Work begins only after your approval.</p>
        <p>Devices left unclaimed beyond 90 days may incur storage fees as communicated at intake.</p>
      </div>
    </Section>
  );
}
