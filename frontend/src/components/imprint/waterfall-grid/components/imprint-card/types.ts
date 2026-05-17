import type { ImprintListItem } from '@/types/imprint'

export interface ImprintCardProps {
  item: ImprintListItem
}

export interface ImprintCardEmits {
  click: [id: string]
}
