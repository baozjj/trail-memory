import { http } from '@/api/axios'
import { unwrapApiData } from '@/api/unwrap'
import type { ApiSuccess } from '@/types/auth'
import type { ImprintTypeDefinition } from '@/config/imprint-types/types'

/** 拉取 C 端可用的印记类型（仅 enabled） */
export async function fetchPublicImprintTypes(): Promise<ImprintTypeDefinition[]> {
  const { data } = await http.get<ApiSuccess<{ items: ImprintTypeDefinition[] }>>(
    '/api/imprint-types',
  )
  return unwrapApiData(data).items
}
