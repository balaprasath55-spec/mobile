export type AppRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

const rank: Record<AppRole, number> = {
  STAFF: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function hasMinRole(userRole: AppRole | undefined, required: AppRole) {
  if (!userRole) return false;
  return rank[userRole] >= rank[required];
}

export function canManageUsers(role: AppRole | undefined) {
  return role === "SUPER_ADMIN";
}

export function canViewAuditLog(role: AppRole | undefined) {
  return role === "SUPER_ADMIN";
}
