"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/content";
import { motionEase } from "@/lib/utils";

export function ProcessTracker() {
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {processSteps.map((step, i) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: motionEase }}
          className="relative rounded-2xl bg-white p-5 soft-shadow dark:bg-navy-800"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Step {i + 1}
          </span>
          <h3 className="mt-2 font-display text-lg font-semibold text-navy dark:text-white">{step.title}</h3>
          <p className="mt-1 text-sm text-muted">{step.desc}</p>
        </motion.li>
      ))}
    </ol>
  );
}
