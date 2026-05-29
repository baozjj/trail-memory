const MAX_FILE_SIZE = 50 * 1024 * 1024
// 目标体积（KB）：后续按需改这个值即可调整压缩强度
const TARGET_MAX_SIZE_KB = 200
const TARGET_MAX_SIZE_BYTES = TARGET_MAX_SIZE_KB * 1024
// 先降分辨率再降质量，尽量在视觉可接受范围内逼近目标体积
const MAX_DIMENSION_STEPS = [1600, 1400, 1200, 1000, 900, 800] as const
const JPEG_QUALITY_STEPS = [58, 50, 42, 36, 30, 24, 20] as const

type Size = {
  width: number
  height: number
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file)
}

async function loadImageElement(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片解析失败，请重试'))
      img.src = objectUrl
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function getTargetSize(width: number, height: number, maxWidth: number, maxHeight: number): Size {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

async function drawToImageData(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<ImageData> {
  // 优先走 createImageBitmap（通常更快），不支持时回退到 Image 元素解码
  const supportsImageBitmap = typeof createImageBitmap === 'function'
  if (supportsImageBitmap) {
    const bitmap = await loadBitmap(file)
    try {
      const target = getTargetSize(bitmap.width, bitmap.height, maxWidth, maxHeight)
      const canvas = document.createElement('canvas')
      canvas.width = target.width
      canvas.height = target.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('浏览器不支持 Canvas 2D')
      context.drawImage(bitmap, 0, 0, target.width, target.height)
      return context.getImageData(0, 0, target.width, target.height)
    } finally {
      bitmap.close()
    }
  }

  const image = await loadImageElement(file)
  const target = getTargetSize(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    maxWidth,
    maxHeight,
  )
  const canvas = document.createElement('canvas')
  canvas.width = target.width
  canvas.height = target.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('浏览器不支持 Canvas 2D')
  context.drawImage(image, 0, 0, target.width, target.height)
  return context.getImageData(0, 0, target.width, target.height)
}

/** 前端压缩图片，返回 File/Blob 供直传 OSS 使用（非 Base64） */
export async function compressImage(file: File): Promise<File | Blob> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('图片体积过大，请选择 50MB 以内的照片')
  }

  const [{ encode }] = await Promise.all([import('@jsquash/jpeg')])
  // 记录全流程最小结果：即便达不到目标 200KB，也返回“能压到的最小值”
  let bestBlob: Blob | null = null

  // 双层迭代：每个分辨率下尝试多档质量，命中目标后立即返回
  for (const dimension of MAX_DIMENSION_STEPS) {
    const imageData = await drawToImageData(file, dimension, dimension)
    for (const quality of JPEG_QUALITY_STEPS) {
      const encodedBuffer = await encode(imageData, { quality })
      const blob = new Blob([encodedBuffer], { type: 'image/jpeg' })

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob
      }

      if (blob.size <= TARGET_MAX_SIZE_BYTES) {
        return blob
      }
    }
  }

  if (bestBlob) return bestBlob
  throw new Error('图片压缩失败，请重试')
}
