import type { ImprintListItem } from '@/types/imprint'

export function splitWaterfallColumns(items: ImprintListItem[]) {
  const left: ImprintListItem[] = []
  const right: ImprintListItem[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) left.push(item)
    else right.push(item)
  })
  return { left, right }
}
