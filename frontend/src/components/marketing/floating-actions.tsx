"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/utils";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-end gap-3 sm:right-5">
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-soft transition-all duration-300 dark:bg-white dark:text-navy ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi, I need a device repair quote.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp us"
        className="group flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition hover:scale-105 sm:px-4 sm:py-3"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <MessageCircle className="h-4 w-4" />
          <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
        </span>
        <span className="pr-1">WhatsApp</span>
      </a>
    </div>
  );
}
