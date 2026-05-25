/** 与前端 config/imprint-types 保持 id 一致 */
const TYPE_COVER_BY_ID: Record<string, string> = {
  'xihu-biaoyi': '/imprint-types/西湖标毅线.png',
  wugongshan: '/imprint-types/武功山.png',
  'xihu-aixin': '/imprint-types/西湖爱心线.png',
  wutongshan: '/imprint-types/梧桐山.png',
}

export const KNOWN_IMPRINT_TYPE_IDS = Object.keys(TYPE_COVER_BY_ID)

export function isKnownImprintTypeId(typeId: string): boolean {
  return typeId in TYPE_COVER_BY_ID
}

/** 列表封面 URL；无类型时为空字符串 */
export function resolveCoverUrlForType(typeId: string | null | undefined): string {
  if (!typeId) return ''
  return TYPE_COVER_BY_ID[typeId] ?? ''
}

const TYPE_LABEL_BY_ID: Record<string, string> = {
  'xihu-biaoyi': '西湖标毅线',
  wugongshan: '武功山',
  'xihu-aixin': '西湖爱心线',
  wutongshan: '梧桐山',
}

/** 印记类型展示名；未知类型返回 null */
export function resolveTypeLabel(typeId: string | null | undefined): string | null {
  if (!typeId) return null
  return TYPE_LABEL_BY_ID[typeId] ?? null
}
