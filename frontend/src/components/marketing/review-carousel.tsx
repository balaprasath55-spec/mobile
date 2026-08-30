"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/content";
import { motionEase } from "@/lib/utils";

export function ReviewCarousel() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8 md:p-12">
      <motion.div
        key={item.name}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: motionEase }}
      >
        <div className="flex gap-1 text-accent-300">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-5 max-w-2xl font-display text-xl sm:mt-6 sm:text-2xl md:text-3xl">
          &ldquo;{item.text}&rdquo;
        </p>
        <p className="mt-5 text-sm text-white/70 sm:mt-6">
          {item.name} · {item.location}
          {"source" in item && item.source ? ` · ${item.source}` : ""}
        </p>
      </motion.div>
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          aria-label="Previous review"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next review"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
