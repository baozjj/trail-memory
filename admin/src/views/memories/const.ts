export const IMPRINT_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'xihu-biaoyi', label: '西湖标毅线' },
  { value: 'wugongshan', label: '武功山' },
  { value: 'xihu-aixin', label: '西湖爱心线' },
  { value: 'wutongshan', label: '梧桐山' },
]

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
