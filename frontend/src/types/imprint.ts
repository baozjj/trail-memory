export interface Author {
  id: string
  name: string
  bio: string
  avatarUrl: string
}

export interface ImprintListItem {
  id: string
  title: string
  coverUrl: string
  /** 瀑布流高度权重，越大卡片越高 */
  heightWeight: number
}

export interface ImprintArticle {
  id: string
  title: string
  content: string
  meta: string
  images: string[]
  author: Author
}

export interface PublishDraft {
  imageUrls: string[]
  title: string
  description: string
  location: string
  isPublic: boolean
}
