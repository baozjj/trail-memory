import { http } from './axios'
import type { ApiSuccess } from '@/types/auth'

interface UploadImagesData {
  urls: string[]
}

/** 上传图片到本地存储，返回可访问路径 */
export async function uploadImagesApi(files: File[]): Promise<string[]> {
  if (!files.length) return []

  const form = new FormData()
  for (const file of files) {
    form.append('files', file)
  }

  const { data } = await http.post<ApiSuccess<UploadImagesData>>('/api/uploads', form)
  const urls = data.data?.urls
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error('图片上传失败')
  }
  return urls
}
