import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { PriceEstimator } from "@/components/marketing/price-estimator";

export const metadata: Metadata = {
  title: "Price Estimator",
  description: "Get an instant repair price range by brand, model, and issue.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <Section>
      <SectionHeading
        title="Price estimator"
        subtitle="Select your brand and model to see repair price ranges — back door, battery, display, and more. Final quote after free diagnosis."
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-surface" />}>
        <PriceEstimator />
      </Suspense>
    </Section>
  );
}
