import type { ImprintListItem } from '@/types/imprint'

export interface WaterfallGridProps {
  items: ImprintListItem[]
}

export interface WaterfallGridEmits {
  select: [id: string]
}
