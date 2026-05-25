/** 管理员角色（与 Prisma AdminRole 枚举一致，M01 落库） */
export type AdminRole = 'SUPER_ADMIN' | 'OPERATOR' | 'VIEWER'

/** adminAuthMiddleware 注入的 JWT 载荷 */
export interface AdminAuthPayload {
  adminUserId: string
  email: string
  role: AdminRole
}
