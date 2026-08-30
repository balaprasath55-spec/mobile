"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn, motionEase } from "@/lib/utils";

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: motionEase },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  variants = defaultVariants,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn("overflow-visible", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("overflow-visible", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={{ delay, duration: 0.6, ease: motionEase }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn("overflow-visible", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("overflow-visible", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn("overflow-visible", className)} variants={defaultVariants}>
      {children}
    </motion.div>
  );
}
