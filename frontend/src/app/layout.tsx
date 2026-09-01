import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";
import { SITE } from "@/lib/utils";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c111a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE.name} | Premium Mobile Repair Chennai`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    "Premium iPhone, iPad & Android repair in Chennai. Display, battery, back glass, motherboard specialists. All-India courier service.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} min-h-screen overflow-x-clip bg-white antialiased dark:bg-navy-900`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
