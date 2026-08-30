import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/section";
import { serverApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Supported Devices",
  description: "Browse brands and models we repair, and jump straight into the price estimator.",
  alternates: { canonical: "/devices" },
};

export default async function DevicesPage() {
  const { brands: brandList } = await serverApi<{ brands: { id: string; name: string }[] }>("/api/brands");
  const brands = await Promise.all(
    brandList.map(async (brand) => {
      const { models } = await serverApi<{ models: { id: string; name: string }[] }>(
        `/api/models?brandId=${encodeURIComponent(brand.id)}`
      );
      return { ...brand, models };
    })
  );

  return (
    <Section>
      <SectionHeading
        title="Devices we repair"
        subtitle="Pick a model to prefill the price estimator."
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
