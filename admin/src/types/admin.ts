/** 管理员角色 */
export type AdminRole = 'SUPER_ADMIN' | 'OPERATOR' | 'VIEWER'

/** 管理员状态 */
export type AdminStatus = 'ACTIVE' | 'DISABLED'

/** 管理员公开信息 */
export interface AdminProfile {
  id: string
  email: string
  displayName: string
  role: AdminRole
  status: AdminStatus
  lastLoginAt: string | null
  createdAt: string
}

/** 管理员列表项 */
export interface AdminListItem {
  id: string
  email: string
  displayName: string
  role: AdminRole
  status: AdminStatus
  lastLoginAt: string | null
  createdAt: string
}
