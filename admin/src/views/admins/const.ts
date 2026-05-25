import type { AdminRole, AdminStatus } from '@/types/admin'

export const ADMIN_ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: '超级管理员' },
  { value: 'OPERATOR', label: '运营' },
  { value: 'VIEWER', label: '只读' },
]

export const ADMIN_STATUS_OPTIONS: { value: AdminStatus; label: string }[] = [
  { value: 'ACTIVE', label: '正常' },
  { value: 'DISABLED', label: '已禁用' },
]

export function roleLabel(role: AdminRole): string {
  return ADMIN_ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role
}

export function statusLabel(status: AdminStatus): string {
  return ADMIN_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function roleTheme(role: AdminRole): 'danger' | 'warning' | 'default' {
  if (role === 'SUPER_ADMIN') return 'danger'
  if (role === 'OPERATOR') return 'warning'
  return 'default'
}

export function statusTheme(status: AdminStatus): 'success' | 'default' {
  return status === 'ACTIVE' ? 'success' : 'default'
}
