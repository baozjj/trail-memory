import { getActivePinia } from 'pinia'
import type { ImprintTypeDefinition } from './types'
import { useImprintTypesStore } from '@/stores/imprint-types'

/** 接口失败时的兜底注册表（与种子数据一致） */
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

const fallbackById = new Map<string, ImprintTypeDefinition>(
  IMPRINT_TYPE_REGISTRY.map((item) => [item.id, item]),
)

function enabledRegistry(): ImprintTypeDefinition[] {
  const pinia = getActivePinia()
  if (pinia) {
    const store = useImprintTypesStore(pinia)
    if (store.loaded && store.enabledItems.length > 0) {
      return store.enabledItems
    }
  }
  return [...IMPRINT_TYPE_REGISTRY]
}

export function getImprintTypeById(
  typeId: string | null | undefined,
): ImprintTypeDefinition | undefined {
  if (!typeId) return undefined
  const fromEnabled = enabledRegistry().find((item) => item.id === typeId)
  if (fromEnabled) return fromEnabled
  return fallbackById.get(typeId)
}

export function getImprintTypeLabel(typeId: string | null | undefined): string | undefined {
  return getImprintTypeById(typeId)?.label
}

export function isKnownImprintTypeId(typeId: string): boolean {
  return Boolean(getImprintTypeById(typeId))
}

export function resolveImprintTypeCoverSrc(typeId: string | null | undefined): string | null {
  return getImprintTypeById(typeId)?.coverSrc ?? null
}

/** 发布页可选类型（仅 enabled，按 API 顺序） */
export function getEnabledImprintTypes(): ImprintTypeDefinition[] {
  return enabledRegistry()
}
