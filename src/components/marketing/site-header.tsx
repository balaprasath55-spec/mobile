"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Phone, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, SITE } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/devices", label: "Devices" },
  { href: "/courier", label: "Courier" },
  { href: "/gallery", label: "Gallery" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const preferDark = stored === "dark";
    setDark(preferDark);
    document.documentElement.classList.toggle("dark", preferDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const overHero = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        overHero
          ? "border-transparent bg-transparent"
          : "border-b border-navy/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/85"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className={cn(
            "font-display text-lg font-semibold tracking-tight transition",
            overHero ? "text-white" : "text-navy dark:text-white"
          )}
        >
          MR <span className={overHero ? "text-accent-300" : "text-accent"}>Mobile</span> Zone
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm transition",
                overHero
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-muted hover:text-navy dark:hover:text-white",
                pathname === item.href &&
                  (overHero ? "bg-white/10 text-white" : "bg-navy/5 text-navy dark:bg-white/10 dark:text-white")
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className={cn(
              "rounded-full p-2 transition",
              overHero ? "text-white/70 hover:bg-white/10" : "text-muted hover:bg-navy/5 dark:hover:bg-white/10"
            )}
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className={cn(
              "rounded-full p-2 transition",
              overHero ? "text-white/70 hover:bg-white/10" : "text-muted hover:bg-navy/5 dark:hover:bg-white/10"
            )}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button
            asChild
            size="sm"
            className={cn("hidden sm:inline-flex", overHero && "bg-white text-navy hover:bg-white/90")}
            variant={overHero ? "secondary" : "accent"}
          >
            <a href={`tel:${SITE.phone}`}>
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className={cn("hidden md:inline-flex", overHero && "border-white/30 bg-transparent text-white hover:bg-white/10")}
            variant={overHero ? "outline" : "default"}
          >
            <Link href="/enquiry">Book repair</Link>
          </Button>
          <button
            type="button"
            className={cn("rounded-full p-2 lg:hidden", overHero ? "text-white" : "text-navy dark:text-white")}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-navy/5 bg-white px-4 py-4 lg:hidden dark:border-white/10 dark:bg-navy-900">
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-navy dark:text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${SITE.phone}`}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-navy/10 px-4 py-3.5 text-sm font-medium text-navy dark:border-white/15 dark:text-white"
            >
              <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
            </a>
            <Link
              href="/enquiry"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-3.5 text-center text-sm font-semibold text-white"
            >
              Book repair
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
