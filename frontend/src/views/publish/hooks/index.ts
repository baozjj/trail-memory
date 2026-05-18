import { reactive, toRefs } from 'vue'
import { createDefaultPublishDraft } from '@/mock'
import type { PublishDraft } from '@/types/imprint'

export function usePublishDraft(initial?: Partial<PublishDraft>) {
  const draft = reactive<PublishDraft>({
    ...createDefaultPublishDraft(),
    ...initial,
  })

  function addImage(url: string) {
    if (draft.imageUrls.length >= 9) return
    draft.imageUrls.push(url)
  }

  function resetDraft() {
    Object.assign(draft, createDefaultPublishDraft())
  }

  return {
    ...toRefs(draft),
    draft,
    addImage,
    resetDraft,
  }
}
