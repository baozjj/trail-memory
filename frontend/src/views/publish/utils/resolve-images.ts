import { uploadImagesApi } from '@/api/uploads'
import { isBlobImageUrl } from '../utils'

/** 将 blob 预览地址转为 File */
async function blobUrlToFile(blobUrl: string): Promise<File> {
  const response = await fetch(blobUrl)
  const blob = await response.blob()
  const ext = blob.type.split('/')[1] ?? 'jpg'
  return new File([blob], `image-${Date.now()}.${ext}`, { type: blob.type || 'image/jpeg' })
}

/** 已是服务端或远程地址则直接保留 */
function isRemoteOrUploadedUrl(url: string): boolean {
  return url.startsWith('/uploads/') || /^https?:\/\//.test(url)
}

/** 发布前将草稿图片统一解析为可提交 URL 列表 */
export async function resolvePublishImageUrls(urls: string[]): Promise<string[]> {
  const result: string[] = []
  const filesToUpload: File[] = []
  const placeholderIndexes: number[] = []

  for (const url of urls) {
    if (isBlobImageUrl(url)) {
      placeholderIndexes.push(result.length)
      result.push('')
      filesToUpload.push(await blobUrlToFile(url))
      continue
    }
    if (isRemoteOrUploadedUrl(url)) {
      result.push(url)
    }
  }

  if (filesToUpload.length) {
    const uploaded = await uploadImagesApi(filesToUpload)
    if (uploaded.length !== filesToUpload.length) {
      throw new Error('部分图片上传失败，请重试')
    }
    for (let i = 0; i < placeholderIndexes.length; i++) {
      const index = placeholderIndexes[i]!
      result[index] = uploaded[i]!
    }
  }

  return result.filter(Boolean)
}
