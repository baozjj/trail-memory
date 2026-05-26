import type { ImprintType, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError, notFoundError } from "../../types/app-error.js";
import {
  invalidateImprintTypeCache,
  warmImprintTypeCache,
} from "../../imprint-types/service.js";
import { writeAuditLog } from "../shared/audit.js";
import type {
  CreateImprintTypeBody,
  ListImprintTypesQuery,
  UpdateImprintTypeBody,
} from "./schema.js";
import type { AdminImprintType } from "./types.js";
import { getImprintCoverImageInfo } from "../../lib/imprint-cover-info.js";

async function toAdminDto(row: ImprintType): Promise<AdminImprintType> {
  const coverInfo = await getImprintCoverImageInfo(row.coverPath);
  return {
    id: row.id,
    label: row.label,
    coverPath: row.coverPath,
    coverInfo,
    sortOrder: row.sortOrder,
    enabled: row.enabled,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function refreshCache(): Promise<void> {
  invalidateImprintTypeCache();
  await warmImprintTypeCache();
}

/** 全部印记类型 */
export async function listImprintTypes(
  query: ListImprintTypesQuery = {},
): Promise<AdminImprintType[]> {
  const where: Prisma.ImprintTypeWhereInput = {};
  const q = query.q?.trim();
  if (q) {
    where.OR = [{ id: { contains: q } }, { label: { contains: q } }];
  }
  if (query.enabled !== undefined) {
    where.enabled = query.enabled;
  }

  const rows = await prisma.imprintType.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
  return await Promise.all(rows.map((row) => toAdminDto(row)));
}

/** 新建印记类型 */
export async function createImprintType(
  body: CreateImprintTypeBody,
  actor: { adminUserId: string; ip?: string },
): Promise<AdminImprintType> {
  const existing = await prisma.imprintType.findUnique({ where: { id: body.id } });
  if (existing) {
    throw new AppError("该类型 id 已存在", 409, "CONFLICT");
  }

  const row = await prisma.imprintType.create({
    data: {
      id: body.id,
      label: body.label.trim(),
      coverPath: body.coverPath,
      sortOrder: body.sortOrder,
      enabled: body.enabled,
    },
  });

  await refreshCache();
  await writeAuditLog({
    adminUserId: actor.adminUserId,
    action: "IMPRINT_TYPE_CREATE",
    targetType: "ImprintType",
    targetId: row.id,
    payload: { label: row.label, enabled: row.enabled },
    ip: actor.ip,
  });

  return await toAdminDto(row);
}

/** 更新印记类型 */
export async function updateImprintType(
  id: string,
  body: UpdateImprintTypeBody,
  actor: { adminUserId: string; ip?: string },
): Promise<AdminImprintType> {
  const existing = await prisma.imprintType.findUnique({ where: { id } });
  if (!existing) {
    throw notFoundError("印记类型不存在");
  }

  const row = await prisma.imprintType.update({
    where: { id },
    data: {
      ...(body.label !== undefined ? { label: body.label.trim() } : {}),
      ...(body.coverPath !== undefined ? { coverPath: body.coverPath } : {}),
      ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
      ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
    },
  });

  await refreshCache();
  await writeAuditLog({
    adminUserId: actor.adminUserId,
    action: "IMPRINT_TYPE_UPDATE",
    targetType: "ImprintType",
    targetId: id,
    payload: body,
    ip: actor.ip,
  });

  return await toAdminDto(row);
}
