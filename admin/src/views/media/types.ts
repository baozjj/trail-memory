export interface MediaStats {
  fileCount: number
  totalBytes: number
}

export interface MediaListItem {
  filename: string
  url: string
  sizeBytes: number
  mimeType: string | null
  mtime: string
  referenced: boolean
  referenceCount: number
}

export interface MediaMemoryRef {
  id: string
  title: string
  ownerEmail: string
  ownerNickname: string
  deletedAt: string | null
}

export interface MediaUserRef {
  id: string
  email: string
  nickname: string
}

export interface MediaReferences {
  filename: string
  url: string
  sizeBytes: number
  mimeType: string | null
  mtime: string
  memories: MediaMemoryRef[]
  users: MediaUserRef[]
}
