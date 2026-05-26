import { ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import type { RequestMethodResponse, UploadFile } from 'tdesign-mobile-vue/es/upload/type'
import { compressImage } from '@/utils/imageCompressor'
import type { PublishDraft } from '@/types/imprint'
import { revokeBlobImageUrls } from '../utils'

const BYTES_PER_KB = 1024

function formatSizeKb(bytes: number): string {
  return (bytes / BYTES_PER_KB).toFixed(2)
}

function toCompressedFile(blob: File | Blob, original: File): File {
  if (blob instanceof File) return blob
  const baseName = original.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

export type PublishImageUploadRef = {
  triggerUpload?: (event?: Event) => void
}

export function usePublishImageUpload(draft: PublishDraft) {
  const compressing = ref(false)
  const uploadRef = ref<PublishImageUploadRef | null>(null)

  async function requestMethod(files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> {
    const list = (Array.isArray(files) ? files : [files]).filter((item) =>
      item.raw?.type.startsWith('image/'),
    )
    if (!list.length) {
      return { status: 'fail', error: '未选择有效图片', response: {} }
    }

    compressing.value = true
    const previewUrls: string[] = []

    try {
      for (const item of list) {
        const raw = item.raw!
        const beforeKb = formatSizeKb(raw.size)

        let compressed: File | Blob
        try {
          compressed = await compressImage(raw)
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : '图片压缩失败'
          Toast({ message })
          revokeBlobImageUrls(previewUrls)
          return { status: 'fail', error: message, response: {} }
        }

        const file = toCompressedFile(compressed, raw)
        const afterKb = formatSizeKb(file.size)
        console.log(`[imageCompressor] ${raw.name}: ${beforeKb} KB → ${afterKb} KB`)

        previewUrls.push(URL.createObjectURL(file))
      }

      for (const url of previewUrls) {
        draft.imageUrls.push(url)
      }

      return {
        status: 'success',
        response: { url: previewUrls[0] ?? '' },
      }
    } finally {
      compressing.value = false
    }
  }

  function pickFromAlbum() {
    if (compressing.value) return
    uploadRef.value?.triggerUpload?.()
  }

  return {
    compressing,
    uploadRef,
    requestMethod,
    pickFromAlbum,
  }
}
