import bcrypt from "bcrypt";
import type { AdminUser } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError, notFoundError } from "../../types/app-error.js";
import { toPublicAdmin } from "../auth/service.js";
import type { PublicAdmin } from "../auth/types.js";
import {
  paginationQuerySchema,
  toPrismaPagination,
  type PaginationQuery,
} from "../shared/pagination.js";
import { writeAuditLog } from "../shared/audit.js";
import type {
  CreateAdminBody,
  ResetAdminPasswordBody,
  UpdateAdminBody,
} from "./schema.js";

const BCRYPT_ROUNDS = 10;

const listSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

type AdminListRow = Pick<
  AdminUser,
  | "id"
  | "email"
  | "displayName"
  | "role"
  | "status"
  | "lastLoginAt"
  | "createdAt"
>;

function toListItem(admin: AdminListRow) {
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

/** 分页列表管理员 */
export async function listAdmins(query: PaginationQuery) {
  const parsed = paginationQuerySchema.parse(query);
  const { skip, take } = toPrismaPagination(parsed);

  const [items, total] = await Promise.all([
    prisma.adminUser.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: listSelect,
    }),
    prisma.adminUser.count(),
  ]);

  return {
    items: items.map(toListItem),
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

/** 创建管理员 */
export async function createAdmin(body: CreateAdminBody): Promise<PublicAdmin> {
  const email = body.email.trim().toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("该邮箱已被使用", 409, "CONFLICT");
  }

  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      displayName: body.displayName.trim(),
      role: body.role,
    },
  });

  return toPublicAdmin(admin);
}

/** 更新管理员 */
export async function updateAdmin(
  id: string,
  body: UpdateAdminBody,
  currentAdminId: string,
): Promise<PublicAdmin> {
  const admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) {
    throw notFoundError("管理员不存在");
  }

  if (body.status === "DISABLED" && id === currentAdminId) {
    throw new AppError("不能禁用自己的账号", 403, "FORBIDDEN");
  }

  const updated = await prisma.adminUser.update({
    where: { id },
    data: {
      displayName: body.displayName?.trim(),
      role: body.role,
      status: body.status,
    },
  });

  return toPublicAdmin(updated);
}

/** 重置管理员密码 */
export async function resetAdminPassword(
  id: string,
  body: ResetAdminPasswordBody,
  actor: { adminUserId: string; ip?: string },
): Promise<void> {
  const admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) {
    throw notFoundError("管理员不存在");
  }

  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  await prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });

  await writeAuditLog({
    adminUserId: actor.adminUserId,
    action: "ADMIN_RESET_PASSWORD",
    targetType: "AdminUser",
    targetId: id,
    ip: actor.ip,
  });
}
