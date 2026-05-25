import bcrypt from "bcrypt";
import type { AdminUser } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { signAdminToken } from "../../lib/admin-jwt.js";
import { AppError } from "../../types/app-error.js";
import type { AdminLoginBody } from "./schema.js";
import type { PublicAdmin } from "./types.js";

const LOGIN_FAIL_MESSAGE = "邮箱或密码错误";

/** 将数据库管理员转为 API 响应结构 */
export function toPublicAdmin(admin: AdminUser): PublicAdmin {
  return {
    id: admin.id,
    email: admin.email,
    displayName: admin.displayName,
    role: admin.role,
    status: admin.status,
    lastLoginAt: admin.lastLoginAt?.toISOString() ?? null,
    createdAt: admin.createdAt.toISOString(),
  };
}

/** 管理员登录 */
export async function loginAdmin(
  body: AdminLoginBody,
): Promise<{ admin: PublicAdmin; token: string }> {
  const email = body.email.trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || admin.status !== "ACTIVE") {
    throw new AppError(LOGIN_FAIL_MESSAGE, 401, "INVALID_CREDENTIALS");
  }

  const ok = await bcrypt.compare(body.password, admin.passwordHash);
  if (!ok) {
    throw new AppError(LOGIN_FAIL_MESSAGE, 401, "INVALID_CREDENTIALS");
  }

  const updated = await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signAdminToken({
    adminUserId: updated.id,
    email: updated.email,
    role: updated.role,
  });

  return { admin: toPublicAdmin(updated), token };
}

/** 按 ID 获取管理员 */
export async function getAdminById(
  adminUserId: string,
): Promise<PublicAdmin | null> {
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminUserId },
  });
  return admin ? toPublicAdmin(admin) : null;
}
