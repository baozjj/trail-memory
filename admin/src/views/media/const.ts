/** 引用状态筛选 */
export const REFERENCED_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'true', label: '已引用' },
  { value: 'false', label: '未引用' },
] as const

/** 格式化字节为人类可读大小 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** 总容量展示（MB，保留 1 位小数） */
export function formatTotalMb(totalBytes: number): string {
  return (totalBytes / (1024 * 1024)).toFixed(1)
}
