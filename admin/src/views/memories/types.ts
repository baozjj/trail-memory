/** 印记列表项 */
export interface MemoryListItem {
  id: string
  title: string
  ownerEmail: string
  ownerNickname: string
  typeId: string | null
  typeLabel: string | null
  isPublic: boolean
  linkSuffix: string
  shareSlug: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

/** 印记详情 */
export interface MemoryDetail extends MemoryListItem {
  content: string
  meta: string
  images: string[]
  imageInfos: Array<{
    url: string
    filename: string
    sizeBytes: number | null
  }>
  coverUrl: string
  heightWeight: number
  user: {
    id: string
    email: string
    nickname: string
  }
}

/** 列表筛选 */
export interface MemoryListFilters {
  q?: string
  userEmail?: string
  isPublic?: boolean
  typeId?: string
  hasDeleted?: boolean
  createdFrom?: string
  createdTo?: string
}
