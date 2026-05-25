export interface AdminMenuItem {
  value: string
  label: string
  to?: { name: string }
  disabled?: boolean
  /** 仅超级管理员可见 */
  superAdminOnly?: boolean
}
