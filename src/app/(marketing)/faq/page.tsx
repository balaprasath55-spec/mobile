import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/content";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about repairs and courier service.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };

  return (
    <Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SectionHeading title="FAQ" subtitle={`Everything you need to know before visiting ${SITE.shortName}.`} />
      <div className="space-y-10">
        {faqs.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 font-display text-xl font-semibold text-navy dark:text-white">{group.category}</h3>
            <Accordion type="single" collapsible className="max-w-3xl">
              {group.items.map((item, i) => (
                <AccordionItem key={item.q} value={`${group.category}-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </Section>
  );
}
