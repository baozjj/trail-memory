export interface PublishImageRowProps {
  images: string[]
  maxCount?: number
}

export interface PublishImageRowEmits {
  add: []
  remove: [index: number]
}
