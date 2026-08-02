import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
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
