/** 封面文件信息（与后端 coverInfo 对齐） */
export interface ImprintCoverImageInfo {
  filename: string
  sizeBytes: number | null
}

/** 印记类型 */
export interface ImprintTypeItem {
  id: string
  label: string
  coverPath: string
  coverInfo: ImprintCoverImageInfo
  sortOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateImprintTypePayload {
  id: string
  label: string
  coverPath: string
  sortOrder: number
  enabled: boolean
}

export interface UpdateImprintTypePayload {
  label?: string
  coverPath?: string
  sortOrder?: number
  enabled?: boolean
}

/** 六边形封面处理预览 */
export interface ImprintCoverPreview {
  token: string
  previewBase64: string
  hexWidth: number
  hexHeight: number
  canvasSize: number
  suggestedCoverPath: string
}
