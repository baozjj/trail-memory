import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type {
  MediaListItem,
  MediaReferences,
  MediaStats,
} from '@/views/media/types'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListMediaParams {
  page?: number
  pageSize?: number
  q?: string
  referenced?: boolean
}

/** 存储统计 */
export async function fetchMediaStats(): Promise<MediaStats> {
  const { data } = await http.get<ApiSuccessBody<MediaStats>>('/api/admin/media/stats')
  return data.data
}

/** 分页列出上传图片 */
export async function listMedia(
  params: ListMediaParams = {},
): Promise<PaginatedResult<MediaListItem>> {
  const query: Record<string, string | number | boolean> = {}
  if (params.page) query.page = params.page
  if (params.pageSize) query.pageSize = params.pageSize
  if (params.q) query.q = params.q
  if (params.referenced === true) query.referenced = 'true'
  if (params.referenced === false) query.referenced = 'false'

  const { data } = await http.get<ApiSuccessBody<PaginatedResult<MediaListItem>>>(
    '/api/admin/media',
    { params: query },
  )
  return data.data
}

/** 文件引用详情（所属印记、用户头像等） */
export async function fetchMediaReferences(filename: string): Promise<MediaReferences> {
  const { data } = await http.get<ApiSuccessBody<MediaReferences>>(
    `/api/admin/media/${encodeURIComponent(filename)}/references`,
  )
  return data.data
}
