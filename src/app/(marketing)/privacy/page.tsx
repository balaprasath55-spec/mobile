import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Section>
      <SectionHeading title="Privacy Policy" subtitle={`How ${SITE.name} handles your information.`} />
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
        <p>We collect enquiry details (name, phone, device info) solely to provide repair quotes and service.</p>
        <p>Images you upload are used for diagnosis and may be stored securely for job records.</p>
        <p>We do not sell personal data. Contact {SITE.email} for data requests.</p>
      </div>
    </Section>
  );
}
