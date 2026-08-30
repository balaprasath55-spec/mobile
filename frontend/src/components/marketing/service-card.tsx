"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Battery,
  Cpu,
  Layers,
  Smartphone,
  Tablet,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/lib/content";
import { motionEase } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  Smartphone,
  Battery,
  Layers,
  Cpu,
  Tablet,
  Truck,
};

export function ServiceCardGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((service, i) => {
        const Icon = icons[service.icon] ?? Smartphone;
        return (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: motionEase }}
            whileHover={{ y: -8 }}
          >
            <Link
              href={`/services/${service.slug}`}
              className="group relative block h-full rounded-2xl border border-navy/5 bg-white p-6 soft-shadow transition dark:border-white/10 dark:bg-navy-800"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/10 transition duration-500 group-hover:scale-150" />
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-4 font-display text-xl font-semibold text-navy group-hover:text-accent dark:text-white">
                {service.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
              <p className="relative mt-4 text-xs font-medium text-accent">Learn more →</p>
              <p className="relative mt-1 text-xs text-muted">{service.turnaround}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
