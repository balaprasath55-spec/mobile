"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { motionEase } from "@/lib/utils";

type FeatureBlockProps = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  caption?: string;
  reverse?: boolean;
};

export function FeatureBlock({
  eyebrow,
  title,
  body,
  href,
  cta,
  image,
  imageAlt,
  caption = "Workshop-grade diagnostics · Warranty included",
  reverse,
}: FeatureBlockProps) {
  return (
    <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h3 className="mt-3 font-display text-3xl font-semibold text-navy dark:text-white md:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-muted leading-relaxed">{body}</p>
        <Button asChild className="mt-6" variant="accent">
          <Link href={href}>
            {cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Reveal>
      <Reveal delay={0.1}>
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.4, ease: motionEase }}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl soft-shadow"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-black/35 px-4 py-3 text-sm text-white backdrop-blur-md">
            {caption}
          </div>
        </motion.div>
      </Reveal>
    </div>
  );
}
