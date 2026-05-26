import type { Memory, User } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../../lib/prisma.js";
import { AppError, notFoundError } from "../../types/app-error.js";
import { resolveTypeLabel } from "../../imprint-types/service.js";
import { resolveCoverUrlForType } from "../../imprint-types/service.js";
import { UPLOAD_DIR } from "../../lib/upload-dir.js";
import { writeAuditLog } from "../shared/audit.js";
import {
  listMemoriesQuerySchema,
  type ForceUnpublishBody,
  type ListMemoriesQuery,
} from "./schema.js";
import type { AdminMemoryDetail, AdminMemoryListItem } from "./types.js";
import { toPrismaPagination } from "../shared/pagination.js";

function buildShareSlug(id: string, linkSuffix: string): string {
  return `${id}-${linkSuffix}`;
}

function parseImages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function extractFilename(url: string): string {
  try {
    const pathname = new URL(url, "http://localhost").pathname;
    return path.basename(pathname);
  } catch {
    return path.basename(url);
  }
}

async function resolveImageSizeBytes(url: string): Promise<number | null> {
  if (!url.startsWith("/uploads/")) {
    return null;
  }
  const relativePath = url.slice("/uploads/".length);
  if (!relativePath || relativePath.includes("..")) {
    return null;
  }
  const filePath = path.join(UPLOAD_DIR, relativePath);
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() ? stat.size : null;
  } catch {
    return null;
  }
}

function toListItem(
  memory: Memory & { user: Pick<User, "email" | "nickname"> },
): AdminMemoryListItem {
  const typeId = memory.typeId ?? null;
  return {
    id: memory.id,
    title: memory.title,
    ownerEmail: memory.user.email,
    ownerNickname: memory.user.nickname,
    typeId,
    typeLabel: resolveTypeLabel(typeId),
    isPublic: memory.isPublic,
    linkSuffix: memory.linkSuffix,
    shareSlug: buildShareSlug(memory.id, memory.linkSuffix),
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt.toISOString(),
    deletedAt: memory.deletedAt?.toISOString() ?? null,
  };
}

async function toDetail(
  memory: Memory & { user: Pick<User, "id" | "email" | "nickname"> },
): Promise<AdminMemoryDetail> {
  const typeId = memory.typeId ?? null;
  const images = parseImages(memory.images);
  const imageInfos = await Promise.all(
    images.map(async (url) => ({
      url,
      filename: extractFilename(url),
      sizeBytes: await resolveImageSizeBytes(url),
    })),
  );
  return {
    ...toListItem(memory),
    content: memory.content,
    meta: memory.meta,
    images,
    imageInfos,
    coverUrl: memory.coverUrl || resolveCoverUrlForType(typeId),
    heightWeight: memory.heightWeight,
    user: {
      id: memory.user.id,
      email: memory.user.email,
      nickname: memory.user.nickname,
    },
  };
}

async function buildListWhere(
  query: ListMemoriesQuery,
): Promise<Prisma.MemoryWhereInput> {
  const where: Prisma.MemoryWhereInput = {};
  const q = query.q?.trim();

  if (query.hasDeleted) {
    where.deletedAt = { not: null };
  } else {
    where.deletedAt = null;
  }

  if (q) {
    where.OR = [{ title: { contains: q } }, { meta: { contains: q } }];
  }

  if (query.userId) {
    where.userId = query.userId;
  } else if (query.userEmail) {
    const email = query.userEmail.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    where.userId = user?.id ?? "__not_found__";
  }

  if (query.isPublic !== undefined) {
    where.isPublic = query.isPublic;
  }

  if (query.typeId) {
    where.typeId = query.typeId;
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

const listInclude = {
  user: { select: { email: true, nickname: true } },
} as const;

/** 分页检索印记 */
export async function listMemories(query: ListMemoriesQuery) {
  const parsed = listMemoriesQuerySchema.parse(query);
  const { skip, take } = toPrismaPagination(parsed);
  const where = await buildListWhere(parsed);

  const [rows, total] = await Promise.all([
    prisma.memory.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: listInclude,
    }),
    prisma.memory.count({ where }),
  ]);

  return {
    items: rows.map(toListItem),
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

/** 印记详情 */
export async function getMemoryDetail(id: string): Promise<AdminMemoryDetail> {
  const memory = await prisma.memory.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, nickname: true } },
    },
  });
  if (!memory) {
    throw notFoundError("印记不存在");
  }
  return await toDetail(memory);
}

/** 强制下架（isPublic → false，幂等不写审计） */
export async function forceUnpublishMemory(
  id: string,
  body: ForceUnpublishBody,
  actor: { adminUserId: string; ip?: string },
): Promise<AdminMemoryDetail> {
  if (body.isPublic !== false) {
    throw new AppError("仅支持强制下架", 400, "VALIDATION_ERROR");
  }

  const memory = await prisma.memory.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, nickname: true } },
    },
  });
  if (!memory) {
    throw notFoundError("印记不存在");
  }

  if (memory.isPublic === false) {
    return await toDetail(memory);
  }

  const updated = await prisma.memory.update({
    where: { id },
    data: { isPublic: false },
    include: {
      user: { select: { id: true, email: true, nickname: true } },
    },
  });

  await writeAuditLog({
    adminUserId: actor.adminUserId,
    action: "MEMORY_FORCE_UNPUBLISH",
    targetType: "Memory",
    targetId: id,
    payload: {
      before: { isPublic: true },
      after: { isPublic: false },
    },
    ip: actor.ip,
  });

  return await toDetail(updated);
}

/** 软删除印记（幂等不写审计） */
export async function softDeleteMemory(
  id: string,
  actor: { adminUserId: string; ip?: string },
): Promise<void> {
  const memory = await prisma.memory.findUnique({ where: { id } });
  if (!memory) {
    throw notFoundError("印记不存在");
  }

  if (memory.deletedAt) {
    return;
  }

  await prisma.memory.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await writeAuditLog({
    adminUserId: actor.adminUserId,
    action: "MEMORY_SOFT_DELETE",
    targetType: "Memory",
    targetId: id,
    ip: actor.ip,
  });
}
