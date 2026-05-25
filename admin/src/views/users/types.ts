/** C 端用户账号状态 */
export type UserStatus = 'ACTIVE' | 'BANNED'

/** 用户列表项 */
export interface UserListItem {
  id: string
  email: string
  nickname: string
  isVerified: boolean
  status: UserStatus
  memoryCount: number
  createdAt: string
}

/** 用户详情 */
export interface UserDetail {
  id: string
  email: string
  nickname: string
  signature: string
  avatarUrl: string
  showCardOnGuestPage: boolean
  isVerified: boolean
  status: UserStatus
  createdAt: string
  updatedAt: string
  stats: {
    memoryCount: number
    publicMemoryCount: number
  }
}

/** 用户印记简表项 */
export interface UserMemoryItem {
  id: string
  title: string
  isPublic: boolean
  createdAt: string
}

/** 列表筛选 */
export interface UserListFilters {
  q?: string
  isVerified?: boolean
  status?: UserStatus
  createdFrom?: string
  createdTo?: string
}
