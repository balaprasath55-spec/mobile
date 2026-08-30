import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  title?: string;
};

export function AppleLogo({ className, title = "Apple" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M16.7 12.6c0-2.2 1.8-3.3 1.9-3.4-1.1-1.5-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 0.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-.1 2.9-2.3.6-.9.9-1.8 1.1-2.3-2.4-1-2.5-3.7-2.5-3.8zm-2.3-6.7c.6-.8 1.1-1.8.9-2.9-1 .1-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.8 1.1.1 2.2-.5 2.9-1.3z"
      />
    </svg>
  );
}

export function SamsungLogo({ className, title = "Samsung" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <text
        x="60"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="1.5"
      >
        SAMSUNG
      </text>
    </svg>
  );
}

export function XiaomiLogo({ className, title = "Xiaomi" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
      <path
        fill="#fff"
        d="M7 7h3.2v10H7V7zm4.8 0H15c2.4 0 4 1.5 4 4.1V17h-3.2v-5.4c0-1.1-.5-1.7-1.5-1.7h-2.5V7z"
      />
    </svg>
  );
}

export function OnePlusLogo({ className, title = "OnePlus" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
      <path fill="#fff" d="M11 6h2v5h5v2h-5v5h-2v-5H6v-2h5V6z" />
    </svg>
  );
}

export function VivoLogo({ className, title = "Vivo" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 80 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <text
        x="40"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="700"
        letterSpacing="2"
      >
        vivo
      </text>
    </svg>
  );
}

export function OppoLogo({ className, title = "Oppo" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 80 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <text
        x="40"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3"
      >
        OPPO
      </text>
    </svg>
  );
}

export function GoogleLogo({ className, title = "Google" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <path
        fill="#4285F4"
        d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.3z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.4 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v2.9C3.7 20.5 7.5 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 13.8c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.5H1.8C1.1 8.1.7 9.9.7 11.6c0 1.8.4 3.5 1.1 5.1l3.8-2.9z"
      />
      <path
        fill="#EA4335"
        d="M12 5.5c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 2 15.1 1 12 1 7.5 1 3.7 3.5 1.8 7.1l3.8 2.9C6.5 7.5 9 5.5 12 5.5z"
      />
    </svg>
  );
}

export function NothingLogo({ className, title = "Nothing" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <circle cx="12" cy="5.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="18.5" r="1.1" fill="currentColor" />
      <circle cx="5.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function RealmeLogo({ className, title = "Realme" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 90 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <text
        x="45"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.5"
      >
        realme
      </text>
    </svg>
  );
}

export function MotorolaLogo({ className, title = "Motorola" }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={title} role="img">
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2.2c1.9 0 3.5 3.5 3.5 7.8S13.9 19.8 12 19.8 8.5 16.3 8.5 12 10.1 4.2 12 4.2z"
      />
    </svg>
  );
}

export const BRAND_LOGOS = [
  { name: "Apple", Logo: AppleLogo, wide: false },
  { name: "Samsung", Logo: SamsungLogo, wide: true },
  { name: "Xiaomi", Logo: XiaomiLogo, wide: false },
  { name: "OnePlus", Logo: OnePlusLogo, wide: false },
  { name: "Vivo", Logo: VivoLogo, wide: true },
  { name: "Oppo", Logo: OppoLogo, wide: true },
  { name: "Google", Logo: GoogleLogo, wide: false },
  { name: "Nothing", Logo: NothingLogo, wide: false },
  { name: "Realme", Logo: RealmeLogo, wide: true },
  { name: "Motorola", Logo: MotorolaLogo, wide: false },
] as const;

export function BrandLogoCard({
  name,
  Logo,
  wide,
  className,
}: {
  name: string;
  Logo: ComponentType<BrandLogoProps>;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-20 min-w-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-navy/8 bg-white px-5 soft-shadow transition hover:-translate-y-0.5 hover:border-accent/30 dark:border-white/10 dark:bg-navy-800",
        className
      )}
    >
      <Logo className={cn("text-navy dark:text-white", wide ? "h-6 w-24" : "h-8 w-8")} />
      <span className="text-[11px] font-medium tracking-wide text-muted">{name}</span>
    </div>
  );
}
