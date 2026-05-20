import type { PublishDraft } from '@/types/imprint'

export function createDefaultPublishDraft(): PublishDraft {
  return {
    imageUrls: [],
    title: '',
    description: '',
    location: '',
    typeId: null,
    isPublic: false,
  }
}
