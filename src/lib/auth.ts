import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DEMO_ADMIN } from "@/lib/demo-store";
import { AUTH_SECRET, ensureAuthUrl } from "@/lib/auth-secret";

ensureAuthUrl();

/**
 * Amplify / production (optional overrides):
 * - NEXTAUTH_SECRET
 * - NEXTAUTH_URL          → https://your-app.amplifyapp.com  (no trailing slash)
 * - NEXT_PUBLIC_SITE_URL  → same public URL
 *
 * A demo fallback secret is used when Amplify does not inject env vars at runtime.
 */
export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          return {
            id: DEMO_ADMIN.id,
            email: DEMO_ADMIN.email,
            name: DEMO_ADMIN.name,
            role: DEMO_ADMIN.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
