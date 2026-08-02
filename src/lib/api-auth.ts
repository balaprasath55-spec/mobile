import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { AppRole } from "@/lib/rbac";
import { hasMinRole } from "@/lib/rbac";

export async function requireAdmin(minRole: AppRole = "STAFF") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role as AppRole | undefined;
  if (!hasMinRole(role, minRole)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return {
    session,
    userId: session.user.id,
    role: role!,
  };
}
