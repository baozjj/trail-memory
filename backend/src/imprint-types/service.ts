import type { ImprintType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const CACHE_TTL_MS = 60_000;

type CachedImprintType = Pick<
  ImprintType,
  "id" | "label" | "coverPath" | "sortOrder" | "enabled"
>;

let cache: CachedImprintType[] | null = null;
let cacheLoadedAt = 0;

/** 从数据库刷新内存缓存 */
export async function warmImprintTypeCache(): Promise<void> {
  cache = await prisma.imprintType.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      label: true,
      coverPath: true,
      sortOrder: true,
      enabled: true,
    },
  });
  cacheLoadedAt = Date.now();
}

/** 使缓存失效（CRUD 后调用） */
export function invalidateImprintTypeCache(): void {
  cache = null;
  cacheLoadedAt = 0;
}

async function ensureCacheFresh(): Promise<CachedImprintType[]> {
  if (!cache || Date.now() - cacheLoadedAt >= CACHE_TTL_MS) {
    await warmImprintTypeCache();
  }
  return cache ?? [];
}

function snapshot(): CachedImprintType[] {
  return cache ?? [];
}

/** 类型是否存在（含已停用，供展示解析） */
export function isKnownImprintTypeId(typeId: string): boolean {
  return snapshot().some((item) => item.id === typeId);
}

/** 类型是否存在且已启用（创建/更新印记校验） */
export function isEnabledImprintTypeId(typeId: string): boolean {
  return snapshot().some((item) => item.id === typeId && item.enabled);
}

/** 列表封面 URL */
export function resolveCoverUrlForType(
  typeId: string | null | undefined,
): string {
  if (!typeId) return "";
  return snapshot().find((item) => item.id === typeId)?.coverPath ?? "";
}

/** 类型展示名（含已停用） */
export function resolveTypeLabel(
  typeId: string | null | undefined,
): string | null {
  if (!typeId) return null;
  return snapshot().find((item) => item.id === typeId)?.label ?? null;
}

/** C 端公开：仅 enabled，sortOrder 升序 */
export async function listEnabledPublicTypes(): Promise<
  Array<{ id: string; label: string; coverSrc: string }>
> {
  const rows = await ensureCacheFresh();
  return rows
    .filter((item) => item.enabled)
    .map((item) => ({
      id: item.id,
      label: item.label,
      coverSrc: item.coverPath,
    }));
}

/** 管理端：全部类型 */
export async function listAllImprintTypes(): Promise<CachedImprintType[]> {
  return ensureCacheFresh();
}

/** 按 id 获取类型 */
export async function getImprintTypeById(
  id: string,
): Promise<CachedImprintType | null> {
  const rows = await ensureCacheFresh();
  return rows.find((item) => item.id === id) ?? null;
}

export type { CachedImprintType as ImprintTypeRecord };
