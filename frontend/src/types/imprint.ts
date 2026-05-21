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
  /** 列表封面由 typeId 解析；历史字段，与类型封面同步 */
  coverUrl: string
  /** 印记类型 id，对应 config/imprint-types 注册表；空表示未选类型 */
  typeId: string | null
  /** 瀑布流高度权重，越大卡片越高 */
  heightWeight: number
  /** 公开展示：开启则游客可看 */
  isPublic: boolean
  /** 分享链接自定义后缀（字母与数字） */
  linkSuffix: string
  /** 列表副文案，如「2024年5月16日 · 四川·稻城亚丁」 */
  meta: string
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
  typeId: string | null
  isPublic: boolean
}
