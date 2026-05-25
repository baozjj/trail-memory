import axios, { type AxiosError } from 'axios'
import router from '@/router'
import type { ApiErrorBody } from '@/types/api'
import { getToken, removeToken } from '@/utils/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

/** 管理端 HTTP 客户端（Token 键 trail_admin_token） */
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
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      removeToken()
      if (router.currentRoute.value.name !== 'login') {
        void router.replace({ name: 'login' })
      }
    }
    return Promise.reject(error)
  },
)

/** 从 axios 错误中提取后端 message */
export function getApiErrorMessage(error: unknown, fallback = '请求失败'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}
