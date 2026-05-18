import type { PublishDraft } from '@/types/imprint'
import { pickImagesFromAlbum } from '../utils'

export function usePickAlbumImages(draft: PublishDraft) {
  async function pickFromAlbum(): Promise<number> {
    const urls = await pickImagesFromAlbum()
    if (!urls.length) return 0

    for (const url of urls) {
      draft.imageUrls.push(url)
    }

    return urls.length
  }

  return { pickFromAlbum }
}
