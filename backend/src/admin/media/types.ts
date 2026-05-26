/** 媒体文件列表项 */
export interface AdminMediaListItem {
  filename: string
  url: string
  sizeBytes: number
  mimeType: string | null
  mtime: string
  referenced: boolean
  referenceCount: number
}

/** 存储统计 */
export interface AdminMediaStats {
  fileCount: number
  totalBytes: number
}

/** 印记引用 */
export interface AdminMediaMemoryRef {
  id: string
  title: string
  ownerEmail: string
  ownerNickname: string
  deletedAt: string | null
}

/** 用户引用（头像） */
export interface AdminMediaUserRef {
  id: string
  email: string
  nickname: string
}

/** 单文件引用详情 */
export interface AdminMediaReferences {
  filename: string
  url: string
  sizeBytes: number
  mimeType: string | null
  mtime: string
  memories: AdminMediaMemoryRef[]
  users: AdminMediaUserRef[]
}
