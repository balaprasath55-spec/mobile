import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_AUTH_COOKIE } from "@/lib/demo-auth";

/** Simple cookie gate for demo admin — no NextAuth. */
export function middleware(req: NextRequest) {
  if (req.cookies.get(DEMO_AUTH_COOKIE)?.value) {
    return NextResponse.next();
  }
  const login = req.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/repairs/:path*",
    "/dealers/:path*",
    "/inventory/:path*",
    "/pricing-admin/:path*",
    "/enquiries/:path*",
    "/attendance/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
