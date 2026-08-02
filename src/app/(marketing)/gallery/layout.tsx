import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Before and after repair gallery from MR Mobile Zone.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
