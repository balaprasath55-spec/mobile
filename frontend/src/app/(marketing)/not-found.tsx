import Link from "next/link";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-navy dark:text-white">Page not found</h1>
        <p className="mt-3 text-muted">That link may be outdated. Try search or head home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">Search</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/services">Services</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
