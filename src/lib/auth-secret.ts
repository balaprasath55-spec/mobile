/**
 * Shared NextAuth secret for API routes + middleware (Edge).
 * Amplify Hosting SSR often does not expose console env vars to the
 * server/middleware runtime, which causes error=Configuration.
 * Prefer NEXTAUTH_SECRET when present; otherwise use the demo fallback.
 */
export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET?.trim() ||
  process.env.AUTH_SECRET?.trim() ||
  "mr-mobile-zone-demo-nextauth-secret-v1";

/** Public site URL used when Amplify omits NEXTAUTH_URL */
export function ensureAuthUrl() {
  if (!process.env.NEXTAUTH_URL?.trim()) {
    process.env.NEXTAUTH_URL =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://main.di9qix63q52bl.amplifyapp.com";
  }
}
