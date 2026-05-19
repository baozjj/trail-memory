import axios, { type AxiosError } from 'axios'
import router from '@/router'
import { getToken, removeToken } from '@/utils/auth'
import type { ApiErrorBody } from '@/types/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

/** 带鉴权与统一错误处理的 HTTP 客户端 */
export const http = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status
    if (status === 401) {
      removeToken()
      const current = router.currentRoute.value.name
      if (current !== 'login' && current !== 'register') {
        void router.replace({ name: 'login' })
      }
    }
    return Promise.reject(error)
  },
)

/** 从 axios 错误中提取后端 message */
export function getApiErrorMessage(error: unknown, fallback = '请求失败'): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback
  }
  return error.response?.data?.error?.message ?? fallback
}
