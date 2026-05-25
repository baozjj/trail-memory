import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { notFoundError } from "../../types/app-error.js";
import {
  paginationQuerySchema,
  toPrismaPagination,
  type PaginationQuery,
} from "../shared/pagination.js";
import { writeAuditLog } from "../shared/audit.js";
import { listUsersQuerySchema, type ListUsersQuery, type UpdateUserBody } from "./schema.js";
import type {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserMemoryItem,
} from "./types.js";

const activeMemoryWhere = { deletedAt: null } as const;

function buildListWhere(query: ListUsersQuery): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};
  const q = query.q?.trim();

  if (q) {
    where.OR = [{ email: { contains: q } }, { nickname: { contains: q } }];
  }

  if (query.isVerified !== undefined) {
    where.isVerified = query.isVerified;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.createdFrom || query.createdTo) {
    where.createdAt = {};
    if (query.createdFrom) {
      where.createdAt.gte = new Date(query.createdFrom);
    }
    if (query.createdTo) {
      const end = new Date(query.createdTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  return where;
}

function toListItem(
  user: {
    id: string;
    email: string;
    nickname: string;
    isVerified: boolean;
    status: AdminUserListItem["status"];
    createdAt: Date;
    _count: { memories: number };
  },
): AdminUserListItem {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    isVerified: user.isVerified,
    status: user.status,
    memoryCount: user._count.memories,
    createdAt: user.createdAt.toISOString(),
  };
}

/** 分页检索用户 */
export async function listUsers(query: ListUsersQuery) {
  const parsed = listUsersQuerySchema.parse(query);
  const { skip, take } = toPrismaPagination(parsed);
  const where = buildListWhere(parsed);

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        nickname: true,
        isVerified: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            memories: { where: activeMemoryWhere },
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: rows.map(toListItem),
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

/** 用户详情 */
export async function getUserDetail(id: string): Promise<AdminUserDetail> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw notFoundError("用户不存在");
  }

  const [memoryCount, publicMemoryCount] = await Promise.all([
    prisma.memory.count({ where: { userId: id, ...activeMemoryWhere } }),
    prisma.memory.count({
      where: { userId: id, isPublic: true, ...activeMemoryWhere },
    }),
  ]);

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    signature: user.signature,
    avatarUrl: user.avatarUrl,
    showCardOnGuestPage: user.showCardOnGuestPage,
    isVerified: user.isVerified,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    stats: { memoryCount, publicMemoryCount },
  };
}

/** 更新用户状态或验证 */
export async function updateUser(
  id: string,
  body: UpdateUserBody,
  actor: { adminUserId: string; ip?: string },
): Promise<AdminUserDetail> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw notFoundError("用户不存在");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.isVerified !== undefined ? { isVerified: body.isVerified } : {}),
    },
  });

  if (body.status !== undefined && body.status !== user.status) {
    await writeAuditLog({
      adminUserId: actor.adminUserId,
      action: body.status === "BANNED" ? "USER_BAN" : "USER_UNBAN",
      targetType: "User",
      targetId: id,
      ip: actor.ip,
    });
  }

  if (body.isVerified === true && !user.isVerified) {
    await writeAuditLog({
      adminUserId: actor.adminUserId,
      action: "USER_VERIFY",
      targetType: "User",
      targetId: id,
      ip: actor.ip,
    });
  }

  return getUserDetail(updated.id);
}

/** 用户印记简表 */
export async function listUserMemories(userId: string, query: PaginationQuery) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) {
    throw notFoundError("用户不存在");
  }

  const parsed = paginationQuerySchema.parse(query);
  const { skip, take } = toPrismaPagination(parsed);

  const where = { userId, ...activeMemoryWhere };

  const [rows, total] = await Promise.all([
    prisma.memory.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        isPublic: true,
        createdAt: true,
      },
    }),
    prisma.memory.count({ where }),
  ]);

  const items: AdminUserMemoryItem[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    isPublic: row.isPublic,
    createdAt: row.createdAt.toISOString(),
  }));

  return {
    items,
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}
