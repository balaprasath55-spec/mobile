"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DevicePicker } from "@/components/marketing/device-picker";
import { motionEase, SITE } from "@/lib/utils";

export function AnimatedHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.85]);

  return (
    <section ref={ref} className="relative -mt-16 overflow-hidden bg-navy pt-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-16 top-40 h-80 w-80 animate-blob-delayed rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-64 w-64 animate-blob rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(15,20,32,0.45)_75%)]" />
        <div className="hero-grid absolute inset-0 opacity-[0.12]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 md:pb-14 md:pt-10">
        <div className="grid min-h-0 items-center gap-8 md:min-h-[52vh] md:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: motionEase }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {SITE.shortName} · {SITE.addressShort}
            </motion.p>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: motionEase }}
              className="mt-5 font-display text-[2rem] font-semibold tracking-tight sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
            >
              Expert care for
              <span className="block bg-gradient-to-r from-white via-accent-200 to-sky-300 bg-clip-text text-transparent">
                every device.
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: motionEase }}
              className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
            >
              Premium iPhone, iPad & Android repair with genuine-quality parts, transparent pricing,
              same-day turnaround, and all-India courier service.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: motionEase }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Button asChild size="lg" className="w-full bg-white text-navy hover:bg-white/90 sm:w-auto">
                <Link href="/enquiry">
                  Book a repair <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/25 text-white hover:bg-white/10 sm:w-auto"
              >
                <Link href="/pricing">Estimate price</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: motionEase }}
            className="relative mx-auto w-full max-w-sm overflow-hidden px-2 sm:overflow-visible sm:px-0"
          >
            <div className="absolute -inset-6 animate-pulse-soft rounded-[2rem] bg-accent/20 blur-2xl" />
            <div className="relative aspect-[9/16] max-h-[480px] overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="flex h-full flex-col rounded-[1.5rem] bg-gradient-to-br from-navy-800 via-navy to-accent-800 p-6">
                <div className="mx-auto h-1.5 w-16 rounded-full bg-white/30" />
                <div className="mt-10 flex-1">
                  <p className="text-xs uppercase tracking-widest text-white/50">Live status</p>
                  <p className="mt-2 font-display text-2xl font-semibold">Display repair</p>
                  <div className="mt-6 space-y-3">
                    {["Received", "In repair", "Delivered"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={reduce ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.12, ease: motionEase }}
                        className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-sm"
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${i < 2 ? "bg-emerald-400" : "animate-pulse bg-amber-300"}`}
                        />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-white/40">Workshop · George Town</p>
              </div>
            </div>

            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm backdrop-blur-md sm:-left-6 sm:bottom-24 sm:px-4 sm:py-3"
            >
              <p className="font-semibold">30–90 min</p>
              <p className="text-xs text-white/60">Typical screen job</p>
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-2 top-20 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm backdrop-blur-md sm:-right-4 sm:top-24 sm:px-4 sm:py-3"
            >
              <p className="font-semibold">146k+</p>
              <p className="text-xs text-white/60">Instagram family</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-14 rounded-2xl border border-white/10 bg-navy-800/50 p-5 backdrop-blur-md md:mt-16 md:p-8">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
          >
            Choose your device
          </motion.p>
          <DevicePicker />
        </div>
      </motion.div>
    </section>
  );
}
