import type { ImprintArticle } from '@/types/imprint'
import type { MemoryArticleDto } from '@/types/memory-api'
import { resolveAvatarUrl } from '@/utils/avatar'
import { resolveMediaUrl, resolveMediaUrls } from '@/utils/media-url'

/** 将接口详情转为页面展示模型 */
export function toImprintArticle(dto: MemoryArticleDto): ImprintArticle {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    meta: dto.meta,
    images: resolveMediaUrls(dto.images),
    author: {
      id: dto.author.id,
      name: dto.author.name,
      bio: dto.author.bio,
      avatarUrl: resolveAvatarUrl(dto.author.avatarUrl),
      showCardOnGuestPage: dto.author.showCardOnGuestPage,
    },
  }
}
