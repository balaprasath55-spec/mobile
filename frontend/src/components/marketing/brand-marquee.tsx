"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BRAND_LOGOS, BrandLogoCard } from "@/components/marketing/brand-logos";

export function BrandMarquee() {
  const loop = [...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <div className="relative">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Trusted brands</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-navy dark:text-white md:text-3xl">
          We repair all major devices
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-surface px-2 py-6 dark:bg-navy-900/60">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface to-transparent dark:from-navy-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent dark:from-navy-900" />

        <motion.div
          className="flex w-max gap-4 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        >
          {loop.map((brand, i) => (
            <Link key={`${brand.name}-${i}`} href="/devices" className="block">
              <BrandLogoCard name={brand.name} Logo={brand.Logo} wide={brand.wide} />
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
