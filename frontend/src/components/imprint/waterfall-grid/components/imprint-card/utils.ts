import { getImprintTypeLabel } from '@/config/imprint-types'
import type { ImprintListItem } from '@/types/imprint'
import { NO_TYPE_LABEL } from './const'

export function buildImprintCardMeta(item: ImprintListItem) {
  const trimmed = item.meta?.trim()
  const text = trimmed || getImprintTypeLabel(item.typeId) || NO_TYPE_LABEL
  return {
    text,
    showPrivateBadge: !item.isPublic,
  }
}
