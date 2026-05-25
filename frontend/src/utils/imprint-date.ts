const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const CN_DATE_RE = /^(\d{4})年(\d{1,2})月(\d{1,2})日$/

/** 历史 meta 中「日期 · 地点」的分隔符 */
const META_DATE_SEP = '·'

export function todayIsoDate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatIsoDateToDisplay(iso: string): string {
  if (!ISO_DATE_RE.test(iso)) return ''
  const [y, m, d] = iso.split('-').map((part) => Number(part))
  if (!y || !m || !d) return ''
  return `${y}年${m}月${d}日`
}

/** 列表/详情展示：仅日期，不含地点 */
export function formatListDateLabel(meta: string | undefined | null): string {
  const trimmed = meta?.trim()
  if (!trimmed) return ''

  if (ISO_DATE_RE.test(trimmed)) {
    return formatIsoDateToDisplay(trimmed)
  }

  const datePart = trimmed.split(META_DATE_SEP)[0]?.trim() ?? trimmed
  const cnMatch = datePart.match(CN_DATE_RE)
  if (cnMatch) {
    return datePart
  }

  return ''
}

/** 从 meta（ISO 或历史中文日期）解析为 input[type=date] 用的 YYYY-MM-DD */
export function parseMetaToIsoDate(meta: string | undefined | null): string {
  const trimmed = meta?.trim()
  if (!trimmed) return ''

  if (ISO_DATE_RE.test(trimmed)) {
    return trimmed
  }

  const datePart = trimmed.split(META_DATE_SEP)[0]?.trim() ?? trimmed
  const cnMatch = datePart.match(CN_DATE_RE)
  if (!cnMatch) return ''

  const [, y, mo, d] = cnMatch
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** 提交保存：将 ISO 日期写入 meta 字段 */
export function sealedDateToMeta(iso: string): string {
  return iso.trim()
}

/** TDesign DateTimePicker 使用的本地时间戳 */
export function isoDateToTimestamp(iso: string): number {
  if (!ISO_DATE_RE.test(iso)) {
    return Date.now()
  }
  const [yRaw, mRaw, dRaw] = iso.split('-').map((part) => Number(part))
  const y = yRaw ?? 0
  const m = mRaw ?? 1
  const d = dRaw ?? 1
  return new Date(y, m - 1, d).getTime()
}

/** 将 DateTimePicker 返回值转为 ISO 日期 */
export function timestampToIsoDate(value: string | number): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
