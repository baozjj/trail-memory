import { http } from './axios'
import type {
  ApiSuccess,
  AuthSession,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth'

interface RegisterData {
  user: AuthUser
  token?: string
  needEmailVerification: boolean
}

/** 用户注册 */
export async function registerApi(payload: RegisterPayload): Promise<RegisterData> {
  const { data } = await http.post<ApiSuccess<RegisterData>>('/api/auth/register', payload)
  return data.data
}

/** 用户登录 */
export async function loginApi(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await http.post<ApiSuccess<AuthSession>>('/api/auth/login', payload)
  return data.data
}

/** 获取当前登录用户 */
export async function fetchMeApi(): Promise<AuthUser> {
  const { data } = await http.get<ApiSuccess<{ user: AuthUser }>>('/api/auth/me')
  return data.data.user
}
