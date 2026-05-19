import type { Memory } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError, notFoundError } from '../types/app-error.js'
import type { PatchMemoryBody } from './schema.js'
import type { MemoryDetailDto, MemoryListItemDto } from './types.js'

/** 将数据库印记转为列表 DTO */
export function toMemoryListItemDto(memory: Memory): MemoryListItemDto {
  return {
    id: memory.id,
    title: memory.title,
    coverUrl: memory.coverUrl,
    heightWeight: memory.heightWeight,
    isPublic: memory.isPublic,
    linkSuffix: memory.linkSuffix,
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

/** 将数据库印记转为详情 DTO */
export function toMemoryDetailDto(memory: Memory): MemoryDetailDto {
  return {
    ...toMemoryListItemDto(memory),
    content: memory.content,
    meta: memory.meta,
    images: parseImages(memory.images),
  }
}

/** 按 ID 获取当前用户的印记（不存在或非本人则 null） */
async function findOwnedMemory(
  userId: string,
  memoryId: string,
): Promise<Memory | null> {
  const memory = await prisma.memory.findFirst({
    where: { id: memoryId, userId },
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

/** 获取单条印记详情 */
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

/** 删除印记 */
export async function deleteMemory(
  userId: string,
  memoryId: string,
): Promise<void> {
  const memory = await findOwnedMemory(userId, memoryId)
  if (!memory) {
    throw notFoundError('印记不存在')
  }
  await prisma.memory.delete({ where: { id: memoryId } })
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
  const coverUrl = body.images[0]!
  const heightWeight = body.heightWeight ?? 1

  try {
    const memory = await prisma.memory.create({
      data: {
        userId,
        title: body.title.trim(),
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

  const coverUrl = body.images[0]!
  const linkSuffix = body.linkSuffix ?? memory.linkSuffix

  try {
    const updated = await prisma.memory.update({
      where: { id: memoryId },
      data: {
        title: body.title.trim(),
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
