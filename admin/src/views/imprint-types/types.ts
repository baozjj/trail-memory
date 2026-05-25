/** 印记类型 */
export interface ImprintTypeItem {
  id: string
  label: string
  coverPath: string
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
