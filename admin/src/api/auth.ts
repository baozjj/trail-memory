import { http } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'
import type { AdminProfile } from '@/types/admin'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  admin: AdminProfile
}

/** 管理端登录 */
export async function loginAdmin(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await http.post<ApiSuccessBody<LoginResult>>(
    '/api/admin/auth/login',
    payload,
  )
  return data.data
}

/** 获取当前登录管理员 */
export async function fetchAdminMe(): Promise<AdminProfile> {
  const { data } = await http.get<ApiSuccessBody<{ admin: AdminProfile }>>(
    '/api/admin/auth/me',
  )
  return data.data.admin
}
