/** 与前端 config/imprint-types 保持 id 一致 */
const TYPE_COVER_BY_ID: Record<string, string> = {
  'xihu-biaoyi': '/imprint-types/西湖标毅线.png',
  wugongshan: '/imprint-types/武功山.png',
  'xihu-aixin': '/imprint-types/西湖爱心线.png',
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
