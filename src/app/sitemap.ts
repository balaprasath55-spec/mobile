import type { MetadataRoute } from "next";
import { services } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/devices",
    "/courier",
    "/testimonials",
    "/gallery",
    "/why-us",
    "/faq",
    "/contact",
    "/enquiry",
    "/courses",
    "/course",
    "/privacy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
    })),
  ];
}
