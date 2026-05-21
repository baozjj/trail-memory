#!/usr/bin/env node
/**
 * 将「纯白背景 + 平顶正六边形实体」规范为正方形输出。
 *
 * 流程：
 *   1. 识别实体像素，定位左右顶点 → 推断正六边形几何
 *   2. 按六边形轮廓裁切，只保留六边形内内容（外为透明）
 *   3. 生成正方形白底画布，六边形高 3/5、水平居中、顶边距顶 1/5
 *
 * 用法:
 *   node process_hex_image.mjs input.png -o output.png
 *   npm run process-hex-image -- input.png -o output.png
 */

import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import sharp from 'sharp'

const HEX_HEIGHT_RATIO = Math.sqrt(3)
const WHITE_THRESHOLD = 250

function isBackgroundPixel(r, g, b, a) {
  if (a < 16) return true
  return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD
}

/**
 * @typedef {Object} FlatTopHex
 * @property {number} cx
 * @property {number} cy
 * @property {number} side
 */

/** @param {FlatTopHex} hex */
function hexMetrics(hex) {
  const height = hex.side * HEX_HEIGHT_RATIO
  return {
    height,
    width: 2 * hex.side,
    top: hex.cy - height / 2,
    bottom: hex.cy + height / 2,
    left: hex.cx - hex.side,
    right: hex.cx + hex.side,
  }
}

/** @param {number} x @param {number} y @param {FlatTopHex} hex */
function hexContains(x, y, hex) {
  const { height, top, bottom } = hexMetrics(hex)
  const mid = hex.cy
  if (y < top || y > bottom) return false
  let halfW
  if (y <= mid) {
    const t = mid > top ? (y - top) / (mid - top) : 0
    halfW = hex.side * (0.5 + 0.5 * t)
  } else {
    const t = bottom > mid ? (y - mid) / (bottom - mid) : 0
    halfW = hex.side * (1 - 0.5 * t)
  }
  return Math.abs(x - hex.cx) <= halfW
}

/**
 * @param {Buffer} data - RGBA
 * @param {number} width
 * @param {number} height
 * @returns {FlatTopHex}
 */
function detectFlatTopHex(data, width, height) {
  let minX = width
  let maxX = -1
  let fgCount = 0
  const yHist = new Uint32Array(height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (!isBackgroundPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        yHist[y]++
        fgCount++
      }
    }
  }

  if (fgCount === 0 || maxX < 0) {
    throw new Error('未检测到六边形实体（图片可能全白或路径错误）')
  }

  let medianY = 0
  let seen = 0
  const medianTarget = Math.floor(fgCount / 2)
  for (let y = 0; y < height; y++) {
    seen += yHist[y]
    if (seen > medianTarget) {
      medianY = y
      break
    }
  }

  let leftX = minX
  let leftY = 0
  let leftDist = Infinity
  let rightX = maxX
  let rightY = 0
  let rightDist = Infinity

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (!isBackgroundPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        if (x === minX) {
          const d = Math.abs(y - medianY)
          if (d < leftDist) {
            leftDist = d
            leftY = y
          }
        }
        if (x === maxX) {
          const d = Math.abs(y - medianY)
          if (d < rightDist) {
            rightDist = d
            rightY = y
          }
        }
      }
    }
  }

  const sideFromLR = (rightX - leftX) / 2
  const sideFromSpan = (maxX - minX + 1) / 2
  const side = (sideFromLR + sideFromSpan) / 2

  if (side <= 0) {
    throw new Error('六边形尺寸无效')
  }

  return {
    cx: (leftX + rightX) / 2,
    cy: (leftY + rightY) / 2,
    side,
  }
}

/**
 * @param {Buffer} srcData - RGBA 原图
 * @param {number} srcW
 * @param {number} srcH
 * @param {FlatTopHex} hex
 */
function extractHexagonOnly(srcData, srcW, srcH, hex) {
  const { height, top, left, width } = hexMetrics(hex)
  const cropW = Math.max(1, Math.ceil(width))
  const cropH = Math.max(1, Math.ceil(height))
  const out = Buffer.alloc(cropW * cropH * 4)

  const localHex = { cx: hex.side, cy: height / 2, side: hex.side }

  for (let ly = 0; ly < cropH; ly++) {
    for (let lx = 0; lx < cropW; lx++) {
      const wx = left + lx + 0.5
      const wy = top + ly + 0.5
      if (!hexContains(lx + 0.5, ly + 0.5, localHex)) continue

      const sx = Math.floor(wx)
      const sy = Math.floor(wy)
      if (sx < 0 || sy < 0 || sx >= srcW || sy >= srcH) continue

      const si = (sy * srcW + sx) * 4
      const oi = (ly * cropW + lx) * 4
      out[oi] = srcData[si]
      out[oi + 1] = srcData[si + 1]
      out[oi + 2] = srcData[si + 2]
      out[oi + 3] = srcData[si + 3]
    }
  }

  return { data: out, width: cropW, height: cropH, hexHeight: height }
}

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {{ size?: number }} [options]
 */
export async function processHexImage(inputPath, outputPath, options = {}) {
  const meta = await sharp(inputPath).metadata()
  const srcW = meta.width ?? 0
  const srcH = meta.height ?? 0
  if (!srcW || !srcH) throw new Error('无法读取输入图片尺寸')

  let size = options.size ?? Math.max(srcW, srcH)
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('输出边长必须为正整数')
  }

  const srcData = await sharp(inputPath).ensureAlpha().raw().toBuffer()
  const hex = detectFlatTopHex(srcData, srcW, srcH)
  const { data: cropData, width: cropW, height: cropH, hexHeight } = extractHexagonOnly(
    srcData,
    srcW,
    srcH,
    hex,
  )

  const targetHexHeight = (3 * size) / 5
  const scale = targetHexHeight / hexHeight
  const newW = Math.max(1, Math.round(cropW * scale))
  const newH = Math.max(1, Math.round(cropH * scale))

  const resizedPng = await sharp(cropData, {
    raw: { width: cropW, height: cropH, channels: 4 },
  })
    .resize(newW, newH, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()

  const pasteX = Math.floor((size - newW) / 2)
  const pasteY = Math.round(size / 5)

  await mkdir(path.dirname(path.resolve(outputPath)), { recursive: true })

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resizedPng, left: pasteX, top: pasteY }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  return { size }
}

function printHelp() {
  console.log(`用法:
  node process_hex_image.mjs <输入> -o <输出> [--size N] [--verbose]

识别平顶正六边形 → 裁切实体 → 放入规范正方形画布。`)
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      output: { type: 'string', short: 'o' },
      size: { type: 'string' },
      verbose: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })

  if (values.help || positionals.length === 0) {
    printHelp()
    process.exit(values.help ? 0 : 1)
  }

  const inputPath = positionals[0]
  const outputPath = values.output
  if (!outputPath) {
    console.error('错误: 请使用 -o / --output 指定输出路径')
    process.exit(1)
  }
  if (!existsSync(inputPath)) {
    console.error(`错误: 找不到输入文件 ${inputPath}`)
    process.exit(1)
  }

  const sizeOpt = values.size != null ? Number.parseInt(values.size, 10) : undefined
  if (values.size != null && (!Number.isInteger(sizeOpt) || sizeOpt <= 0)) {
    console.error('错误: --size 必须为正整数')
    process.exit(1)
  }

  try {
    const result = await processHexImage(inputPath, outputPath, { size: sizeOpt })
    console.log(`已写入 ${outputPath} (${result.size}×${result.size})`)
    if (values.verbose) {
      const hexH = (3 * result.size) / 5
      const side = hexH / HEX_HEIGHT_RATIO
      console.log(
        `  上下留白各 ${(result.size / 5).toFixed(1)}px，` +
          `六边形高 ${hexH.toFixed(1)}px、宽 ${(2 * side).toFixed(1)}px`,
      )
    }
  } catch (err) {
    console.error(`错误: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
