import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type {
  MemoryDetail,
  MemoryListFilters,
  MemoryListItem,
} from '@/views/memories/types'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListMemoriesParams extends MemoryListFilters {
  page?: number
  pageSize?: number
}

/** 分页查询印记 */
export async function listMemories(
  params: ListMemoriesParams = {},
): Promise<PaginatedResult<MemoryListItem>> {
  const query: Record<string, string | number | boolean> = {}
  if (params.page) query.page = params.page
  if (params.pageSize) query.pageSize = params.pageSize
  if (params.q) query.q = params.q
  if (params.userEmail) query.userEmail = params.userEmail
  if (params.isPublic !== undefined) query.isPublic = params.isPublic ? 'true' : 'false'
  if (params.typeId) query.typeId = params.typeId
  if (params.hasDeleted === true) query.hasDeleted = 'true'
  if (params.createdFrom) query.createdFrom = params.createdFrom
  if (params.createdTo) query.createdTo = params.createdTo

  const { data } = await http.get<ApiSuccessBody<PaginatedResult<MemoryListItem>>>(
    '/api/admin/memories',
    { params: query },
  )
  return data.data
}

/** 印记详情 */
export async function fetchMemoryDetail(id: string): Promise<MemoryDetail> {
  const { data } = await http.get<ApiSuccessBody<{ memory: MemoryDetail }>>(
    `/api/admin/memories/${id}`,
  )
  return data.data.memory
}

/** 强制下架 */
export async function forceUnpublishMemory(id: string): Promise<MemoryDetail> {
  const { data } = await http.patch<ApiSuccessBody<{ memory: MemoryDetail }>>(
    `/api/admin/memories/${id}/exhibit`,
    { isPublic: false },
  )
  return data.data.memory
}

/** 软删除印记 */
export async function softDeleteMemory(id: string): Promise<void> {
  await http.delete(`/api/admin/memories/${id}`)
}
