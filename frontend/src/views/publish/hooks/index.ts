import { onUnmounted, reactive, toRefs, watch } from 'vue'
import { createDefaultPublishDraft } from '@/mock'
import type { PublishDraft } from '@/types/imprint'
import { isBlobImageUrl, revokeBlobImageUrls } from '../utils'
import { usePickAlbumImages } from './use-pick-album-images'

export function usePublishDraft(initial?: Partial<PublishDraft>) {
  const draft = reactive<PublishDraft>({
    ...createDefaultPublishDraft(),
    ...initial,
  })

  const { pickFromAlbum } = usePickAlbumImages(draft)

  function addImage(url: string) {
    draft.imageUrls.push(url)
  }

  function resetDraft() {
    revokeBlobImageUrls(draft.imageUrls)
    Object.assign(draft, createDefaultPublishDraft())
  }

  watch(
    () => [...draft.imageUrls],
    (urls, prevUrls) => {
      if (!prevUrls?.length) return
      for (const url of prevUrls) {
        if (!urls.includes(url) && isBlobImageUrl(url)) {
          URL.revokeObjectURL(url)
        }
      }
    },
  )

  onUnmounted(() => {
    revokeBlobImageUrls(draft.imageUrls)
  })

  return {
    ...toRefs(draft),
    draft,
    addImage,
    pickFromAlbum,
    resetDraft,
  }
}
