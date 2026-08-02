"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { motionEase } from "@/lib/utils";

const devices = [
  { name: "iPhone", href: "/pricing", image: "/devices/iphone.png" },
  { name: "iPad", href: "/services/iphone-ipad", image: "/devices/ipad.png" },
  { name: "Android", href: "/devices", image: "/devices/android.png" },
  { name: "MacBook", href: "/enquiry?device=MacBook", image: "/devices/macbook.png" },
  { name: "Watch", href: "/enquiry?device=Apple%20Watch", image: "/devices/watch.png" },
] as const;

export function DevicePicker() {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
      {devices.map((d, i) => (
        <motion.div
          key={d.name}
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: motionEase }}
          whileHover={reduce ? undefined : { y: -8, scale: 1.02 }}
        >
          <Link
            href={d.href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes="(max-width: 768px) 45vw, 180px"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={i < 2}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            </div>
            <div className="relative -mt-10 px-3 pb-4 pt-2">
              <span className="font-display text-sm font-semibold text-white drop-shadow md:text-base">
                {d.name}
              </span>
              <span className="mt-1 block text-xs text-white/70 opacity-0 transition group-hover:opacity-100">
                Repair now →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
