const TOKEN_KEY = 'trail_admin_token'

/** 读取管理端访问令牌 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** 持久化管理端访问令牌 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 清除管理端访问令牌 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
