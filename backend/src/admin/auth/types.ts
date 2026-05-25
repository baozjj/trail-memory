import type { AdminRole, AdminStatus } from "@prisma/client";

/** 对外暴露的管理员信息 */
export interface PublicAdmin {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string | null;
  createdAt: string;
}
