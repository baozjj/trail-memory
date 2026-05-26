/**
 * 批量压缩 backend/uploads 中的用户上传图片并原地替换。
 * 参数与前端 compressorjs 对齐：最长边 1920、JPEG/WebP quality 60。
 *
 * 用法：
 *   npm run compress-uploads --prefix backend
 *   npm run compress-uploads --prefix backend -- --dry-run
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import sharp from 'sharp'
import { PrismaClient } from '@prisma/client'
import { UPLOAD_DIR } from '../src/lib/upload-dir.js'

const MAX_DIMENSION = 1920
const QUALITY = 60
const UPLOAD_PREFIX = '/uploads/'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

const prisma = new PrismaClient()

type FileResult = {
  filename: string
  beforeBytes: number
  afterBytes: number
  action: 'compressed' | 'converted' | 'skipped'
  reason?: string
  newFilename?: string
}

function parseImages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

function uploadUrl(filename: string): string {
  return `${UPLOAD_PREFIX}${filename}`
}

function replaceFilenameInUrl(url: string, oldFilename: string, newFilename: string): string {
  const from = uploadUrl(oldFilename)
  if (url === from) return uploadUrl(newFilename)
  return url
}

async function buildPipeline(inputPath: string): Promise<sharp.Sharp> {
  return sharp(inputPath, { failOn: 'none' })
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
}

async function renderJpeg(pipeline: sharp.Sharp): Promise<Buffer> {
  return pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer()
}

async function renderWebp(pipeline: sharp.Sharp): Promise<Buffer> {
  return pipeline.clone().webp({ quality: QUALITY }).toBuffer()
}

async function renderPng(pipeline: sharp.Sharp): Promise<Buffer> {
  return pipeline
    .clone()
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toBuffer()
}

async function renderGif(pipeline: sharp.Sharp): Promise<Buffer> {
  return pipeline.clone().gif().toBuffer()
}

async function compressOne(
  filePath: string,
  dryRun: boolean,
  force: boolean,
): Promise<FileResult> {
  const filename = path.basename(filePath)
  const ext = path.extname(filename).toLowerCase()

  if (!IMAGE_EXT.has(ext) || filename === '.gitkeep') {
    return { filename, beforeBytes: 0, afterBytes: 0, action: 'skipped', reason: '非图片' }
  }

  const beforeBytes = (await fs.promises.stat(filePath)).size
  const pipeline = await buildPipeline(filePath)

  if (ext === '.gif') {
    const meta = await sharp(filePath).metadata()
    if ((meta.pages ?? 1) > 1) {
      return {
        filename,
        beforeBytes,
        afterBytes: beforeBytes,
        action: 'skipped',
        reason: '动图 GIF 跳过',
      }
    }
    const gifBuffer = await renderGif(pipeline)
    return await writeResult({
      filePath,
      filename,
      beforeBytes,
      buffer: gifBuffer,
      dryRun,
      force,
      action: 'compressed',
    })
  }

  const jpegBuffer = await renderJpeg(pipeline)
  const keepSameFormat =
    ext === '.jpg' || ext === '.jpeg'
      ? jpegBuffer
      : ext === '.webp'
        ? await renderWebp(pipeline)
        : ext === '.png'
          ? await renderPng(pipeline)
          : jpegBuffer

  const preferJpeg =
    ext === '.png' || ext === '.webp'
      ? jpegBuffer.length < keepSameFormat.length
      : false

  const buffer = preferJpeg ? jpegBuffer : keepSameFormat
  const newFilename = preferJpeg
    ? `${filename.slice(0, -ext.length)}.jpg`
    : filename

  return await writeResult({
    filePath,
    filename,
    beforeBytes,
    buffer,
    dryRun,
    force,
    action: preferJpeg ? 'converted' : 'compressed',
    newFilename: preferJpeg ? newFilename : undefined,
  })
}

async function writeResult(input: {
  filePath: string
  filename: string
  beforeBytes: number
  buffer: Buffer
  dryRun: boolean
  force: boolean
  action: 'compressed' | 'converted'
  newFilename?: string
}): Promise<FileResult> {
  const {
    filePath,
    filename,
    beforeBytes,
    buffer,
    dryRun,
    force,
    action,
    newFilename,
  } = input
  const afterBytes = buffer.length
  const minGain = force ? 0 : 0.05

  if (afterBytes >= beforeBytes * (1 - minGain)) {
    return {
      filename,
      beforeBytes,
      afterBytes: beforeBytes,
      action: 'skipped',
      reason: '压缩收益不足（可用 --force 强制写入）',
    }
  }

  if (!dryRun) {
    const targetPath = newFilename
      ? path.join(path.dirname(filePath), newFilename)
      : filePath
    const tmpPath = `${targetPath}.compress-tmp`
    await fs.promises.writeFile(tmpPath, buffer)
    await fs.promises.rename(tmpPath, targetPath)
    if (newFilename && newFilename !== filename) {
      await fs.promises.unlink(filePath)
    }
  }

  return {
    filename,
    beforeBytes,
    afterBytes,
    action,
    newFilename,
  }
}

async function applyUrlRenames(
  renames: Map<string, string>,
  dryRun: boolean,
): Promise<number> {
  if (renames.size === 0) return 0

  let updated = 0

  const users = await prisma.user.findMany({
    where: { avatarUrl: { startsWith: UPLOAD_PREFIX } },
    select: { id: true, avatarUrl: true },
  })
  for (const user of users) {
    let next = user.avatarUrl
    for (const [oldName, newName] of renames) {
      next = replaceFilenameInUrl(next, oldName, newName)
    }
    if (next !== user.avatarUrl) {
      if (!dryRun) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: next },
        })
      }
      updated += 1
    }
  }

  const memories = await prisma.memory.findMany({
    select: { id: true, coverUrl: true, images: true },
  })
  for (const memory of memories) {
    let coverUrl = memory.coverUrl
    let images = parseImages(memory.images)
    let changed = false

    for (const [oldName, newName] of renames) {
      const nextCover = replaceFilenameInUrl(coverUrl, oldName, newName)
      if (nextCover !== coverUrl) {
        coverUrl = nextCover
        changed = true
      }
      images = images.map((url) => replaceFilenameInUrl(url, oldName, newName))
    }

    const nextImagesJson = JSON.stringify(images)
    if (changed || nextImagesJson !== memory.images) {
      if (!dryRun) {
        await prisma.memory.update({
          where: { id: memory.id },
          data: { coverUrl, images: nextImagesJson },
        })
      }
      updated += 1
    }
  }

  return updated
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'dry-run': { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
  })

  const dryRun = values['dry-run'] ?? false
  const force = values.force ?? false

  if (!fs.existsSync(UPLOAD_DIR)) {
    console.error(`[!] 上传目录不存在: ${UPLOAD_DIR}`)
    process.exit(1)
  }

  const entries = await fs.promises.readdir(UPLOAD_DIR)
  const files = entries
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .map((name) => path.join(UPLOAD_DIR, name))
    .sort()

  if (files.length === 0) {
    console.log('[*] uploads 目录下没有待处理图片')
    return
  }

  console.log(
    `[*] 目录: ${UPLOAD_DIR}\n[*] 待处理 ${files.length} 个文件${dryRun ? '（dry-run，不写盘）' : ''}`,
  )

  const results: FileResult[] = []
  const renames = new Map<string, string>()

  for (const filePath of files) {
    let result: FileResult
    try {
      result = await compressOne(filePath, dryRun, force)
    } catch (err) {
      const filename = path.basename(filePath)
      const message = err instanceof Error ? err.message : String(err)
      result = {
        filename,
        beforeBytes: (await fs.promises.stat(filePath)).size,
        afterBytes: 0,
        action: 'skipped',
        reason: `处理失败: ${message.split('\n')[0]}`,
      }
    }
    results.push(result)

    if (
      result.action === 'converted' &&
      result.newFilename &&
      result.newFilename !== result.filename
    ) {
      renames.set(result.filename, result.newFilename)
    }

    const tag =
      result.action === 'skipped'
        ? `跳过 (${result.reason})`
        : result.action === 'converted'
          ? `转 JPEG → ${result.newFilename}`
          : '已压缩'

    console.log(
      `  ${result.filename}: ${formatBytes(result.beforeBytes)} → ${formatBytes(result.afterBytes)}  ${tag}`,
    )
  }

  const dbUpdates = await applyUrlRenames(renames, dryRun)
  if (renames.size > 0) {
    console.log(
      `\n[*] 扩展名变更 ${renames.size} 个，${dryRun ? '将更新' : '已更新'}数据库记录 ${dbUpdates} 条`,
    )
  }

  const compressed = results.filter((r) => r.action !== 'skipped')
  const saved = compressed.reduce(
    (sum, r) => sum + Math.max(0, r.beforeBytes - r.afterBytes),
    0,
  )

  console.log(
    `\n[完成] 处理 ${compressed.length} / ${results.length}，共节省约 ${formatBytes(saved)}`,
  )
}

main()
  .catch((err: unknown) => {
    console.error('[!] 执行失败:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
