import type { MetadataRoute } from "next";
import { services } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/displays",
    "/testimonials",
    "/why-us",
    "/faq",
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
