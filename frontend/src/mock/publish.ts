import type { PublishDraft } from '@/types/imprint'
import { todayIsoDate } from '@/utils/imprint-date'

export function createDefaultPublishDraft(): PublishDraft {
  return {
    imageUrls: [],
    title: '',
    description: '',
    sealedDate: todayIsoDate(),
    typeId: null,
    isPublic: false,
  }
}
