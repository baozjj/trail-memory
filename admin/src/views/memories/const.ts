export const PUBLIC_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'true', label: '公开' },
  { value: 'false', label: '私密' },
]

export function publicLabel(isPublic: boolean): string {
  return isPublic ? '公开' : '私密'
}

export function publicTheme(isPublic: boolean): 'success' | 'default' {
  return isPublic ? 'success' : 'default'
}

export function deletedLabel(deletedAt: string | null): string {
  return deletedAt ? '已删除' : '正常'
}

export function deletedTheme(deletedAt: string | null): 'default' | 'danger' {
  return deletedAt ? 'danger' : 'default'
}

export const CONTENT_PREVIEW_LENGTH = 500
