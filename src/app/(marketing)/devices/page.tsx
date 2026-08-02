import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/section";
import { getStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Supported Devices",
  description: "Browse brands and models we repair — jump straight into the price estimator.",
  alternates: { canonical: "/devices" },
};

export default function DevicesPage() {
  const store = getStore();
  const brands = store.brands
    .filter((b) => b.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((brand) => ({
      ...brand,
      models: store.models
        .filter((m) => m.brandId === brand.id && m.isActive)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return (
    <Section>
      <SectionHeading
        title="Devices we repair"
        subtitle="Pick a model to prefill the price estimator. Demo catalogue — no database required."
      />
      <div className="space-y-10">
        {brands.map((brand) => (
          <div key={brand.id}>
            <h3 className="font-display text-2xl font-semibold text-navy dark:text-white">{brand.name}</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {brand.models.map((model) => (
                <li key={model.id}>
                  <Link
                    href={`/pricing?brandId=${brand.id}&modelId=${model.id}`}
                    className="block rounded-2xl border border-navy/5 px-4 py-3 text-sm transition hover:border-accent/40 hover:bg-accent/5 dark:border-white/10"
                  >
                    {model.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
