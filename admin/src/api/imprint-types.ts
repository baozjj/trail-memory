import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type {
  CreateImprintTypePayload,
  ImprintCoverImageInfo,
  ImprintCoverPreview,
  ImprintTypeItem,
  UpdateImprintTypePayload,
} from '@/views/imprint-types/types'

/** 全部印记类型 */
export async function listImprintTypes(params?: {
  q?: string
  enabled?: boolean
}): Promise<ImprintTypeItem[]> {
  const { data } = await http.get<ApiSuccessBody<{ items: ImprintTypeItem[] }>>(
    '/api/admin/imprint-types',
    { params },
  )
  return data.data.items
}

/** 新建印记类型 */
export async function createImprintType(
  payload: CreateImprintTypePayload,
): Promise<ImprintTypeItem> {
  const { data } = await http.post<ApiSuccessBody<{ item: ImprintTypeItem }>>(
    '/api/admin/imprint-types',
    payload,
  )
  return data.data.item
}

/** 更新印记类型 */
export async function updateImprintType(
  id: string,
  payload: UpdateImprintTypePayload,
): Promise<ImprintTypeItem> {
  const { data } = await http.patch<ApiSuccessBody<{ item: ImprintTypeItem }>>(
    `/api/admin/imprint-types/${id}`,
    payload,
  )
  return data.data.item
}

/** 上传并处理六边形封面原图 */
export async function processImprintCover(
  file: File,
  typeId?: string,
): Promise<ImprintCoverPreview> {
  const form = new FormData()
  form.append('file', file)
  if (typeId?.trim()) {
    form.append('typeId', typeId.trim())
  }
  const { data } = await http.post<ApiSuccessBody<{ preview: ImprintCoverPreview }>>(
    '/api/admin/imprint-types/process-cover',
    form,
    { timeout: 60000 },
  )
  return data.data.preview
}

/** 确认封面并写入静态目录 */
export async function confirmImprintCover(
  token: string,
  typeId: string,
): Promise<{ coverPath: string; coverInfo: ImprintCoverImageInfo }> {
  const { data } = await http.post<
    ApiSuccessBody<{ coverPath: string; coverInfo: ImprintCoverImageInfo }>
  >('/api/admin/imprint-types/confirm-cover', { token, typeId })
  return data.data
}
