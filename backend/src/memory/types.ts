/** 印记列表项（与前端 ImprintListItem 对齐） */
export interface MemoryListItemDto {
  id: string
  title: string
  coverUrl: string
  heightWeight: number
  isPublic: boolean
  linkSuffix: string
}

/** 印记详情（含正文与图片） */
export interface MemoryDetailDto extends MemoryListItemDto {
  content: string
  meta: string
  images: string[]
}
