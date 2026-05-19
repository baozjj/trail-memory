import type { ApiSuccess } from '@/types/auth'

/** 从统一成功响应中取出 data 字段 */
export function unwrapApiData<T>(body: ApiSuccess<T>): T {
  if (body?.success !== true || body.data === undefined || body.data === null) {
    throw new Error('接口返回数据格式异常')
  }
  return body.data
}
