import { ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { getApiErrorMessage } from '@/api/axios'
import { createMemoryApi, fetchMemoryByIdApi, updateMemoryApi } from '@/api/memories'
import { useImprintStore } from '@/stores/imprint'
import { buildImprintShareLink } from '@/utils/imprint-link'
import { isValidLinkSuffix } from '@/utils/imprint-link'
import type { PublishDraft } from '@/types/imprint'
import { parseMetaToIsoDate, sealedDateToMeta } from '@/utils/imprint-date'
import { resolvePublishImageUrls } from '../utils/resolve-images'

export interface PublishSubmitOptions {
  editId: string | null
  draft: PublishDraft
  linkSuffix: string
}

/** 发布页提交：上传图片、创建或更新印记 */
export function usePublishSubmit() {
  const imprintStore = useImprintStore()
  const submitting = ref(false)
  const loadingDetail = ref(false)

  /** 编辑模式加载详情 */
  async function loadEditDetail(id: string, draft: PublishDraft): Promise<string> {
    loadingDetail.value = true
    try {
      const item = await fetchMemoryByIdApi(id)
      draft.title = item.title
      draft.description = item.content
      draft.sealedDate = parseMetaToIsoDate(item.meta)
      draft.isPublic = item.isPublic
      draft.typeId = item.typeId
      draft.imageUrls = [...item.images]
      return item.linkSuffix
    } finally {
      loadingDetail.value = false
    }
  }

  /** 提交创建或更新 */
  async function submit(options: PublishSubmitOptions): Promise<string | null> {
    const { editId, draft, linkSuffix } = options
    const title = draft.title.trim()

    if (!title) {
      Toast({ message: '请填写标题' })
      return null
    }

    if (!draft.imageUrls.length) {
      Toast({ message: '请至少添加一张图片' })
      return null
    }

    if (editId && linkSuffix && !isValidLinkSuffix(linkSuffix)) {
      Toast({ message: '链接后缀仅可包含字母和数字' })
      return null
    }

    submitting.value = true
    try {
      const images = await resolvePublishImageUrls(draft.imageUrls)
      if (!images.length) {
        Toast({ message: '图片上传失败，请重试' })
        return null
      }

      const payload = {
        title,
        content: draft.description.trim(),
        meta: sealedDateToMeta(draft.sealedDate),
        images,
        typeId: draft.typeId,
        isPublic: draft.isPublic,
        ...(editId && linkSuffix ? { linkSuffix } : {}),
      }

      const item = editId ? await updateMemoryApi(editId, payload) : await createMemoryApi(payload)

      try {
        await imprintStore.fetchList()
      } catch {
        // 创建/更新已成功，列表刷新失败时用接口返回值更新本地
        imprintStore.replaceItem(item)
      }

      const saved = imprintStore.getById(item.id) ?? item
      return buildImprintShareLink(saved)
    } catch (error: unknown) {
      Toast({ message: getApiErrorMessage(error, '保存失败') })
      return null
    } finally {
      submitting.value = false
    }
  }

  return {
    submitting,
    loadingDetail,
    loadEditDetail,
    submit,
  }
}
