import { withAuth } from "next-auth/middleware";
import { AUTH_SECRET } from "@/lib/auth-secret";

export default withAuth({
  pages: { signIn: "/login" },
  secret: AUTH_SECRET,
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/repairs/:path*",
    "/inventory/:path*",
    "/pricing-admin/:path*",
    "/enquiries/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
