import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ServiceCardGrid } from "@/components/marketing/service-card";

export const metadata: Metadata = {
  title: "Services",
  description: "Display, battery, back glass, motherboard, iPhone/iPad and courier repair services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <Section>
      <SectionHeading
        title="Repair services"
        subtitle="Specialist work for the devices you rely on every day."
      />
      <ServiceCardGrid />
    </Section>
  );
}
