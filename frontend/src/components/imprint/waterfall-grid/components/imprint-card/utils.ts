import { getImprintTypeLabel } from '@/config/imprint-types'
import type { ImprintListItem } from '@/types/imprint'
import { formatListDateLabel } from '@/utils/imprint-date'
export function buildImprintCardMeta(item: ImprintListItem) {
  return {
    typeText: item.typeLabel ?? getImprintTypeLabel(item.typeId) ?? '',
    dateText: formatListDateLabel(item.meta),
    showPrivateBadge: !item.isPublic,
  }
}
