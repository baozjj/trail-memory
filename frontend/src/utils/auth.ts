const TOKEN_KEY = 'trail_memory_token'

/** 读取本地存储的访问令牌 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** 持久化访问令牌 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 清除访问令牌 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
