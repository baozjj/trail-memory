import type { AdminMenuItem } from './types'

/** 全站侧栏菜单 */
export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { value: 'dashboard', label: '运营看板', to: { name: 'dashboard' } },
  { value: 'users', label: '用户管理', to: { name: 'users' } },
  { value: 'memories', label: '印记管理', to: { name: 'memories' } },
  { value: 'imprint-types', label: '印记类型', to: { name: 'imprint-types' } },
  { value: 'media', label: '媒体资源', to: { name: 'media' }, disabled: true },
  { value: 'audit-logs', label: '操作审计', to: { name: 'audit-logs' }, disabled: true },
  { value: 'settings', label: '系统配置', to: { name: 'settings' }, disabled: true },
  {
    value: 'admins',
    label: '管理员',
    to: { name: 'admins' },
    superAdminOnly: true,
  },
]
