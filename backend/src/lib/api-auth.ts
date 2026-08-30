import type { AppRole } from "@/lib/rbac";
import { DEMO_LOGIN } from "@/lib/demo-auth";

type AuthOk = {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      role: AppRole;
    };
  };
  userId: string;
  role: AppRole;
};

/** Demo mode: always allows (no NextAuth). Keeps the old call-site shape. */
export async function requireAdmin(minRole: AppRole = "STAFF"): Promise<AuthOk> {
  void minRole;
  return {
    session: {
      user: {
        id: "admin_demo",
        email: DEMO_LOGIN.email,
        name: DEMO_LOGIN.name,
        role: "SUPER_ADMIN",
      },
    },
    userId: "admin_demo",
    role: "SUPER_ADMIN",
  };
}
