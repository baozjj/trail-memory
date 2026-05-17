import type { PublishDraft } from '@/types/imprint'
import { MOCK_IMAGES } from './constants'

export function createDefaultPublishDraft(): PublishDraft {
  return {
    imageUrls: [MOCK_IMAGES.mountain, MOCK_IMAGES.mountain, MOCK_IMAGES.mountain],
    title: '',
    description: '',
    location: '',
    isPublic: false,
  }
}
