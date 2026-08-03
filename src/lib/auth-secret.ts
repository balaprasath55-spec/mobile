/**
 * Stable NextAuth secret shared by API routes and Edge middleware.
 *
 * Do NOT read process.env here: Amplify often injects NEXTAUTH_SECRET into
 * the Node SSR runtime but not into Edge middleware. Different secrets cause
 * ERR_TOO_MANY_REDIRECTS (login sees session → /dashboard → middleware
 * rejects → /login → …).
 */
export const AUTH_SECRET = "mr-mobile-zone-demo-nextauth-secret-v1";

/** Public site URL when Amplify omits NEXTAUTH_URL */
export function ensureAuthUrl() {
  process.env.NEXTAUTH_URL =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://main.di9qix63q52bl.amplifyapp.com";
}
