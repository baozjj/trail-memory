export interface ImagePreviewProps {
  visible: boolean
  images: string[]
  /** 打开时定位到的图片索引 */
  initialIndex?: number
}

export interface ImagePreviewEmits {
  'update:visible': [value: boolean]
}
