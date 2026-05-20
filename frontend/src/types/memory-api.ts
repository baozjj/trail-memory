import type { ImprintListItem } from '@/types/imprint'
import type { ApiSuccess } from '@/types/auth'

export type MemoryListItemDto = ImprintListItem

export interface MemoryDetailDto extends ImprintListItem {
  content: string
  meta: string
  images: string[]
}

export interface MemoryAuthorDto {
  id: string
  name: string
  bio: string
  avatarUrl: string
  showCardOnGuestPage: boolean
}

export interface MemoryArticleDto extends MemoryDetailDto {
  author: MemoryAuthorDto
}

export interface PatchMemoryPayload {
  isPublic?: boolean
  linkSuffix?: string
}

export interface SaveMemoryPayload {
  title: string
  content?: string
  meta?: string
  images: string[]
  typeId?: string | null
  isPublic: boolean
  linkSuffix?: string
  heightWeight?: number
}

export type MemoriesListResponse = ApiSuccess<{ items: MemoryListItemDto[] }>
export type MemoryDetailResponse = ApiSuccess<{ item: MemoryDetailDto }>
export type MemoryArticleResponse = ApiSuccess<{ item: MemoryArticleDto }>
export type MemoryPatchResponse = ApiSuccess<{ item: MemoryListItemDto }>
