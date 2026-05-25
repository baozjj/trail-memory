import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type {
  UserDetail,
  UserListFilters,
  UserListItem,
  UserMemoryItem,
  UserStatus,
} from '@/views/users/types'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListUsersParams extends UserListFilters {
  page?: number
  pageSize?: number
}

export interface UpdateUserPayload {
  status?: UserStatus
  isVerified?: boolean
}

/** 分页查询用户 */
export async function listUsers(
  params: ListUsersParams = {},
): Promise<PaginatedResult<UserListItem>> {
  const query: Record<string, string | number | boolean> = {}
  if (params.page) query.page = params.page
  if (params.pageSize) query.pageSize = params.pageSize
  if (params.q) query.q = params.q
  if (params.isVerified !== undefined) query.isVerified = String(params.isVerified)
  if (params.status) query.status = params.status
  if (params.createdFrom) query.createdFrom = params.createdFrom
  if (params.createdTo) query.createdTo = params.createdTo

  const { data } = await http.get<ApiSuccessBody<PaginatedResult<UserListItem>>>(
    '/api/admin/users',
    { params: query },
  )
  return data.data
}

/** 用户详情 */
export async function fetchUserDetail(id: string): Promise<UserDetail> {
  const { data } = await http.get<ApiSuccessBody<{ user: UserDetail }>>(
    `/api/admin/users/${id}`,
  )
  return data.data.user
}

/** 更新用户 */
export async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserDetail> {
  const { data } = await http.patch<ApiSuccessBody<{ user: UserDetail }>>(
    `/api/admin/users/${id}`,
    payload,
  )
  return data.data.user
}

/** 用户印记简表 */
export async function listUserMemories(
  userId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<UserMemoryItem>> {
  const { data } = await http.get<ApiSuccessBody<PaginatedResult<UserMemoryItem>>>(
    `/api/admin/users/${userId}/memories`,
    { params },
  )
  return data.data
}
