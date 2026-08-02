import Link from "next/link";
import { SITE } from "@/lib/utils";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services", label: "All services" },
      { href: "/pricing", label: "Price estimator" },
      { href: "/courier", label: "Courier repair" },
      { href: "/devices", label: "Supported devices" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/why-us", label: "Why us" },
      { href: "/testimonials", label: "Reviews" },
      { href: "/gallery", label: "Gallery" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/enquiry", label: "Enquiry" },
      { href: "/courses", label: "Courses" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: SITE.tagline,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.streetAddress,
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: SITE.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.mapLat,
      longitude: SITE.mapLng,
    },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: SITE.hours
      .filter((h) => h.time !== "Closed")
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        description: h.time,
      })),
    url: process.env.NEXT_PUBLIC_SITE_URL,
  };

  return (
    <footer className="border-t border-navy/5 bg-navy text-white dark:border-white/10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold">
            MR <span className="text-accent-300">Mobile</span> Zone
          </p>
          <p className="mt-3 text-sm text-white/70">{SITE.tagline}</p>
          <p className="mt-4 text-sm text-white/60">{SITE.address}</p>
          <p className="mt-2 text-sm text-white/60">{SITE.phoneDisplay}</p>
          <p className="mt-2 text-sm text-white/60">{SITE.email}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold tracking-wide text-white/90">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
