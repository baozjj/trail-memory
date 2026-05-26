import Compressor from 'compressorjs'

const MAX_FILE_SIZE = 50 * 1024 * 1024

/** 前端压缩图片，返回 File/Blob 供直传 OSS 使用（非 Base64） */
export function compressImage(file: File): Promise<File | Blob> {
  if (file.size > MAX_FILE_SIZE) {
    return Promise.reject(new Error('图片体积过大，请选择 50MB 以内的照片'))
  }

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 1920,
      maxHeight: 1920,
      mimeType: 'image/jpeg',
      success: (result) => resolve(result),
      error: (error) => reject(error),
    })
  })
}
