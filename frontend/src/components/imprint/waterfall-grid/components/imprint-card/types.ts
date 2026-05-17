import type { ImprintListItem } from '@/types/imprint'

export interface ImprintCardProps {
  item: ImprintListItem
}

export interface ImprintCardEmits {
  select: [id: string]
  more: [id: string]
}
