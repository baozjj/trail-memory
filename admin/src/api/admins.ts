import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type { AdminListItem, AdminProfile, AdminRole } from '@/types/admin'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListAdminsParams {
  page?: number
  pageSize?: number
}

export interface CreateAdminPayload {
  email: string
  password: string
  displayName: string
  role: AdminRole
}

export interface UpdateAdminPayload {
  displayName?: string
  role?: AdminRole
  status?: 'ACTIVE' | 'DISABLED'
}

/** 分页查询管理员 */
export async function listAdmins(
  params: ListAdminsParams = {},
): Promise<PaginatedResult<AdminListItem>> {
  const { data } = await http.get<ApiSuccessBody<PaginatedResult<AdminListItem>>>(
    '/api/admin/admins',
    { params },
  )
  return data.data
}

/** 创建管理员 */
export async function createAdmin(
  payload: CreateAdminPayload,
): Promise<AdminProfile> {
  const { data } = await http.post<ApiSuccessBody<{ admin: AdminProfile }>>(
    '/api/admin/admins',
    payload,
  )
  return data.data.admin
}

/** 更新管理员 */
export async function updateAdmin(
  id: string,
  payload: UpdateAdminPayload,
): Promise<AdminProfile> {
  const { data } = await http.patch<ApiSuccessBody<{ admin: AdminProfile }>>(
    `/api/admin/admins/${id}`,
    payload,
  )
  return data.data.admin
}

/** 重置管理员密码 */
export async function resetAdminPassword(
  id: string,
  password: string,
): Promise<void> {
  await http.post(`/api/admin/admins/${id}/reset-password`, { password })
}
