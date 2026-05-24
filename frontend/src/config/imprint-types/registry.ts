import type { ImprintTypeDefinition, ImprintTypeId } from './types'

/** 新增类型：在此追加一项，并将封面图放入 public/imprint-types/ */
export const IMPRINT_TYPE_REGISTRY: readonly ImprintTypeDefinition[] = [
  {
    id: 'xihu-biaoyi',
    label: '西湖标毅线',
    coverSrc: '/imprint-types/西湖标毅线.png',
  },
  {
    id: 'wugongshan',
    label: '武功山',
    coverSrc: '/imprint-types/武功山.png',
  },
  {
    id: 'xihu-aixin',
    label: '西湖爱心线',
    coverSrc: '/imprint-types/西湖爱心线.png',
  },
  {
    id: 'wutongshan',
    label: '梧桐山',
    coverSrc: '/imprint-types/梧桐山.png',
  },
] as const

const byId = new Map<string, ImprintTypeDefinition>(
  IMPRINT_TYPE_REGISTRY.map((item) => [item.id, item]),
)

export function getImprintTypeById(
  typeId: string | null | undefined,
): ImprintTypeDefinition | undefined {
  if (!typeId) return undefined
  return byId.get(typeId)
}

export function getImprintTypeLabel(typeId: string | null | undefined): string | undefined {
  return getImprintTypeById(typeId)?.label
}

export function isKnownImprintTypeId(typeId: string): typeId is ImprintTypeId {
  return byId.has(typeId)
}

/** 列表封面图 URL；无类型或未知类型时返回 null（由 UI 展示六边形占位） */
export function resolveImprintTypeCoverSrc(typeId: string | null | undefined): string | null {
  return getImprintTypeById(typeId)?.coverSrc ?? null
}
