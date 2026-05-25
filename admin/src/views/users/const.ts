import type { UserStatus } from './types'

export const USER_STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'ACTIVE', label: '正常' },
  { value: 'BANNED', label: '已禁用' },
]

export const VERIFY_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'true', label: '已验证' },
  { value: 'false', label: '未验证' },
]

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'ACTIVE', label: '正常' },
  { value: 'BANNED', label: '已禁用' },
]

export function userStatusLabel(status: UserStatus): string {
  return USER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function userStatusTheme(status: UserStatus): 'success' | 'danger' {
  return status === 'ACTIVE' ? 'success' : 'danger'
}

export function verifyLabel(isVerified: boolean): string {
  return isVerified ? '已验证' : '未验证'
}

export function verifyTheme(isVerified: boolean): 'success' | 'warning' {
  return isVerified ? 'success' : 'warning'
}
