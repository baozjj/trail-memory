export interface Author {
  id: string
  name: string
  bio: string
  avatarUrl: string
  /** 是否在详情页展示作者名片 */
  showCardOnGuestPage?: boolean
}

export interface ImprintListItem {
  id: string
  title: string
  coverUrl: string
  /** 瀑布流高度权重，越大卡片越高 */
  heightWeight: number
  /** 公开展示：开启则游客可看 */
  isPublic: boolean
  /** 分享链接自定义后缀（字母与数字） */
  linkSuffix: string
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
