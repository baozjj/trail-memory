import type { Memory, User } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError, notFoundError } from '../types/app-error.js'
import type { PatchMemoryBody } from './schema.js'
import { resolveCoverUrlForType, resolveTypeLabel } from '../imprint-types/service.js'
import type {
  MemoryArticleDto,
  MemoryAuthorDto,
  MemoryDetailDto,
  MemoryListItemDto,
} from './types.js'

/** 将数据库印记转为列表 DTO */
export function toMemoryListItemDto(memory: Memory): MemoryListItemDto {
  const typeId = memory.typeId ?? null
  return {
    id: memory.id,
    title: memory.title,
    typeId,
    typeLabel: resolveTypeLabel(typeId) ?? undefined,
    coverUrl: memory.coverUrl || resolveCoverUrlForType(typeId),
    heightWeight: memory.heightWeight,
    isPublic: memory.isPublic,
    linkSuffix: memory.linkSuffix,
    meta: memory.meta,
    createdAt: memory.createdAt.toISOString(),
  }
}

/** 解析 images JSON 字段 */
function parseImages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

/** 详情页正文图片列表（不含类型封面） */
function resolveDetailImages(memory: Memory): string[] {
  return parseImages(memory.images)
}

/** 将数据库印记转为详情 DTO */
export function toMemoryDetailDto(memory: Memory): MemoryDetailDto {
  return {
    ...toMemoryListItemDto(memory),
    content: memory.content,
    meta: memory.meta,
    images: resolveDetailImages(memory),
  }
}

/** 将用户转为详情页作者名片 */
function toMemoryAuthorDto(user: User): MemoryAuthorDto {
  return {
    id: user.id,
    name: user.nickname,
    bio: user.signature,
    avatarUrl: user.avatarUrl,
    showCardOnGuestPage: user.showCardOnGuestPage,
  }
}

/** 将印记与用户转为详情页完整数据 */
function toMemoryArticleDto(memory: Memory, user: User): MemoryArticleDto {
  return {
    ...toMemoryDetailDto(memory),
    author: toMemoryAuthorDto(user),
  }
}

/** 未软删印记过滤条件 */
const notDeleted = { deletedAt: null } as const

/** 按 ID 获取当前用户的印记（不存在、非本人或已软删则 null） */
async function findOwnedMemory(
  userId: string,
  memoryId: string,
): Promise<Memory | null> {
  const memory = await prisma.memory.findFirst({
    where: { id: memoryId, userId, ...notDeleted },
  })
  return memory
}

/** 获取当前用户的印记列表 */
export async function listMemoriesForUser(
  userId: string,
  query?: string,
): Promise<MemoryListItemDto[]> {
  const q = query?.trim()
  const memories = await prisma.memory.findMany({
    where: {
      userId,
      ...notDeleted,
      ...(q
        ? {
            title: { contains: q },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
  return memories.map(toMemoryListItemDto)
}

/** 获取单条印记详情（仅本人，供编辑） */
export async function getMemoryDetail(
  userId: string,
  memoryId: string,
): Promise<MemoryDetailDto> {
  const memory = await findOwnedMemory(userId, memoryId)
  if (!memory) {
    throw notFoundError('印记不存在')
  }
  return toMemoryDetailDto(memory)
}

/** 解析分享 slug：{id}-{linkSuffix} */
export function parseShareSlug(slug: string): { id: string; linkSuffix: string } | null {
  const trimmed = slug.trim()
  if (!trimmed) return null

  const dashIndex = trimmed.lastIndexOf('-')
  if (dashIndex <= 0) return null

  const id = trimmed.slice(0, dashIndex)
  const linkSuffix = trimmed.slice(dashIndex + 1)
  if (!id || !/^[a-zA-Z0-9]+$/.test(linkSuffix)) return null

  return { id, linkSuffix }
}

/** NFC / 外链进入：校验后缀且仅公开展示 */
export async function getMemoryArticleByShareSlug(
  slug: string,
): Promise<MemoryArticleDto> {
  const parsed = parseShareSlug(slug)
  if (!parsed) {
    throw notFoundError('印记不存在')
  }

  const memory = await prisma.memory.findUnique({
    where: { id: parsed.id },
    include: { user: true },
  })

  if (!memory || memory.linkSuffix !== parsed.linkSuffix) {
    throw notFoundError('印记不存在')
  }

  if (memory.deletedAt) {
    throw notFoundError('印记不存在')
  }

  if (!memory.isPublic) {
    throw notFoundError('印记不存在')
  }

  return toMemoryArticleDto(memory, memory.user)
}

/** 获取印记详情页数据：本人可看私密，游客仅可看公开 */
export async function getMemoryArticleView(
  viewerUserId: string | undefined,
  memoryId: string,
): Promise<MemoryArticleDto> {
  const memory = await prisma.memory.findUnique({
    where: { id: memoryId },
    include: { user: true },
  })
  if (!memory) {
    throw notFoundError('印记不存在')
  }

  if (memory.deletedAt) {
    throw notFoundError('印记不存在')
  }

  const isOwner = viewerUserId === memory.userId
  if (!isOwner && !memory.isPublic) {
    throw notFoundError('印记不存在')
  }

  return toMemoryArticleDto(memory, memory.user)
}

/** 更新展出设置 */
export async function patchMemoryExhibit(
  userId: string,
  memoryId: string,
  body: PatchMemoryBody,
): Promise<MemoryListItemDto> {
  const memory = await findOwnedMemory(userId, memoryId)
  if (!memory) {
    throw notFoundError('印记不存在')
  }

  try {
    const updated = await prisma.memory.update({
      where: { id: memoryId },
      data: {
        ...(body.isPublic !== undefined ? { isPublic: body.isPublic } : {}),
        ...(body.linkSuffix !== undefined ? { linkSuffix: body.linkSuffix } : {}),
      },
    })
    return toMemoryListItemDto(updated)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new AppError('该后缀已被占用', 409, 'LINK_SUFFIX_EXISTS')
    }
    throw err
  }
}

/** 软删除印记（C 端与管理端统一策略） */
export async function deleteMemory(
  userId: string,
  memoryId: string,
): Promise<void> {
  const memory = await findOwnedMemory(userId, memoryId)
  if (!memory) {
    throw notFoundError('印记不存在')
  }
  await prisma.memory.update({
    where: { id: memoryId },
    data: { deletedAt: new Date() },
  })
}

/** 生成默认分享后缀 */
function randomLinkSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

/** 将图片列表序列化存入数据库 */
function serializeImages(images: string[]): string {
  return JSON.stringify(images)
}

/** 创建印记 */
export async function createMemory(
  userId: string,
  body: import('./schema.js').CreateMemoryBody,
): Promise<MemoryDetailDto> {
  const linkSuffix = body.linkSuffix ?? randomLinkSuffix()
  const typeId = body.typeId ?? null
  const coverUrl = resolveCoverUrlForType(typeId)
  const heightWeight = body.heightWeight ?? 1

  try {
    const memory = await prisma.memory.create({
      data: {
        userId,
        title: body.title.trim(),
        typeId,
        coverUrl,
        heightWeight,
        isPublic: body.isPublic,
        linkSuffix,
        content: body.content ?? '',
        meta: body.meta ?? '',
        images: serializeImages(body.images),
      },
    })
    return toMemoryDetailDto(memory)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new AppError('该后缀已被占用', 409, 'LINK_SUFFIX_EXISTS')
    }
    throw err
  }
}

/** 更新印记（发布编辑） */
export async function updateMemory(
  userId: string,
  memoryId: string,
  body: import('./schema.js').UpdateMemoryBody,
): Promise<MemoryDetailDto> {
  const memory = await findOwnedMemory(userId, memoryId)
  if (!memory) {
    throw notFoundError('印记不存在')
  }

  const typeId = body.typeId !== undefined ? body.typeId : memory.typeId
  const coverUrl = resolveCoverUrlForType(typeId)
  const linkSuffix = body.linkSuffix ?? memory.linkSuffix

  try {
    const updated = await prisma.memory.update({
      where: { id: memoryId },
      data: {
        title: body.title.trim(),
        typeId,
        coverUrl,
        heightWeight: body.heightWeight ?? memory.heightWeight,
        isPublic: body.isPublic,
        linkSuffix,
        content: body.content ?? '',
        meta: body.meta ?? '',
        images: serializeImages(body.images),
      },
    })
    return toMemoryDetailDto(updated)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw new AppError('该后缀已被占用', 409, 'LINK_SUFFIX_EXISTS')
    }
    throw err
  }
}
