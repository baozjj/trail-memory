/** JWT 载荷 */
export interface JwtPayload {
  userId: string
  email: string
}

/** 注入到 req 的已登录用户摘要 */
export interface AuthUserPayload {
  userId: string
  email: string
}

/** 返回给前端的用户公开信息 */
export interface PublicUser {
  id: string
  email: string
  nickname: string
  signature: string
  avatarUrl: string
  showCardOnGuestPage: boolean
  isVerified: boolean
}
