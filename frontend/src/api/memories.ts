import { http } from './axios'
import { unwrapApiData } from './unwrap'
import type {
  MemoriesListResponse,
  MemoryArticleResponse,
  MemoryDetailResponse,
  MemoryListItemDto,
  MemoryPatchResponse,
  PatchMemoryPayload,
  SaveMemoryPayload,
} from '@/types/memory-api'

/** 获取当前用户的印记列表 */
export async function fetchMemoriesApi(q?: string): Promise<MemoryListItemDto[]> {
  const { data } = await http.get<MemoriesListResponse>('/api/memories', {
    params: q ? { q } : undefined,
  })
  return unwrapApiData(data).items
}

/** 外链 / NFC 分享进入（/m/{id}-{suffix}） */
export async function fetchMemoryArticleShareApi(slug: string) {
  const { data } = await http.get<MemoryArticleResponse>(
    `/api/memories/share/${encodeURIComponent(slug)}`,
  )
  const item = unwrapApiData(data).item
  if (!item?.id) {
    throw new Error('印记详情数据异常')
  }
  return item
}

/** 获取印记详情页（App 内预览，可选登录） */
export async function fetchMemoryArticleViewApi(id: string) {
  const { data } = await http.get<MemoryArticleResponse>(`/api/memories/view/${id}`)
  const item = unwrapApiData(data).item
  if (!item?.id) {
    throw new Error('印记详情数据异常')
  }
  return item
}

/** 获取单条印记详情（仅本人，编辑用） */
export async function fetchMemoryByIdApi(id: string) {
  const { data } = await http.get<MemoryDetailResponse>(`/api/memories/${id}`)
  const item = unwrapApiData(data).item
  if (!item?.id) {
    throw new Error('印记详情数据异常')
  }
  return item
}

/** 更新展出设置 */
export async function patchMemoryApi(
  id: string,
  payload: PatchMemoryPayload,
): Promise<MemoryListItemDto> {
  const { data } = await http.patch<MemoryPatchResponse>(`/api/memories/${id}`, payload)
  return unwrapApiData(data).item
}

/** 创建印记 */
export async function createMemoryApi(payload: SaveMemoryPayload) {
  const { data } = await http.post<MemoryDetailResponse>('/api/memories', payload)
  const item = unwrapApiData(data).item
  if (!item?.id) {
    throw new Error('创建印记失败：响应数据不完整')
  }
  return item
}

/** 更新印记（发布编辑） */
export async function updateMemoryApi(id: string, payload: SaveMemoryPayload) {
  const { data } = await http.put<MemoryDetailResponse>(`/api/memories/${id}`, payload)
  const item = unwrapApiData(data).item
  if (!item?.id) {
    throw new Error('更新印记失败：响应数据不完整')
  }
  return item
}

/** 删除印记 */
export async function deleteMemoryApi(id: string): Promise<void> {
  await http.delete(`/api/memories/${id}`)
}
