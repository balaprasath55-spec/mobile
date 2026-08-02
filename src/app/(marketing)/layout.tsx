import { FloatingActions } from "@/components/marketing/floating-actions";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}
