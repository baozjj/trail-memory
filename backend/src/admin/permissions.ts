import type { AdminRole } from "@prisma/client";

/** 管理端权限点常量 */
export const AdminPermissions = {
  adminUserRead: "admin.user.read",
  adminUserWrite: "admin.user.write",
  userRead: "user.read",
  userWrite: "user.write",
  memoryRead: "memory.read",
  memoryWrite: "memory.write",
  imprintTypeRead: "imprint-type.read",
  imprintTypeWrite: "imprint-type.write",
  mediaRead: "media.read",
  auditRead: "audit.read",
  settingsRead: "settings.read",
  settingsWrite: "settings.write",
  dashboardRead: "dashboard.read",
} as const;

export type AdminPermission =
  (typeof AdminPermissions)[keyof typeof AdminPermissions];

/** 判断角色是否拥有指定权限 */
export function roleHasPermission(
  role: AdminRole,
  permission: string,
): boolean {
  if (role === "SUPER_ADMIN") {
    return true;
  }

  if (role === "OPERATOR") {
    if (
      permission.startsWith("admin.user.") ||
      permission === AdminPermissions.settingsWrite
    ) {
      return false;
    }
    return true;
  }

  if (permission.endsWith(".read")) {
    return true;
  }
  if (
    permission === AdminPermissions.auditRead ||
    permission === AdminPermissions.dashboardRead
  ) {
    return true;
  }

  return false;
}
