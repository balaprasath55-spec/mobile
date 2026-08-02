"use client";

import { useEffect, useRef, useState } from "react";
import { motionEase } from "@/lib/utils";

function useInView(once = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return { ref, visible };
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, visible } = useInView();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.floor(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value]);

  const formatted =
    value >= 1000 ? `${(n / 1000).toFixed(n >= 1000 ? 0 : 1).replace(/\.0$/, "")}k` : `${n}`;

  return (
    <div ref={ref} className="text-3xl font-semibold tracking-tight text-navy dark:text-white md:text-4xl">
      {formatted}
      {suffix}
    </div>
  );
}

export function StatsCounter({
  devicesRepaired,
  instagram,
  youtube,
  customers,
}: {
  devicesRepaired: number;
  instagram: number;
  youtube: number;
  customers: number;
}) {
  const stats = [
    { label: "Instagram followers", value: instagram, suffix: "+" },
    { label: "YouTube subscribers", value: youtube, suffix: "+" },
    { label: "Customers served", value: customers, suffix: "+" },
    { label: "Devices repaired", value: devicesRepaired, suffix: "+" },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-6 md:grid-cols-4"
      style={{ transition: `all 0.5s cubic-bezier(${motionEase.join(",")})` }}
    >
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl bg-white p-5 soft-shadow dark:bg-navy-800">
          <AnimatedNumber value={s.value} suffix={s.suffix} />
          <p className="mt-2 text-sm text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
