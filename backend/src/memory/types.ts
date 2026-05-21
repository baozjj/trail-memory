/** 印记列表项（与前端 ImprintListItem 对齐） */
export interface MemoryListItemDto {
  id: string
  title: string
  coverUrl: string
  typeId: string | null
  heightWeight: number
  isPublic: boolean
  linkSuffix: string
  meta: string
  /** ISO 8601，列表按此倒序展示 */
  createdAt: string
}

/** 印记详情（含正文与图片） */
export interface MemoryDetailDto extends MemoryListItemDto {
  content: string
  meta: string
  images: string[]
}

/** 作者名片（详情页展示） */
export interface MemoryAuthorDto {
  id: string
  name: string
  bio: string
  avatarUrl: string
  showCardOnGuestPage: boolean
}

/** 印记详情页（含作者，供游客/预览） */
export interface MemoryArticleDto extends MemoryDetailDto {
  author: MemoryAuthorDto
}
