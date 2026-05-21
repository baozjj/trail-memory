import type { ImprintListItem } from '@/types/imprint'

/** 按 heightWeight 累计高度贪心分列，使两列视觉高度更均衡 */
export function splitWaterfallColumns(items: ImprintListItem[]) {
  const left: ImprintListItem[] = []
  const right: ImprintListItem[] = []
  let leftHeight = 0
  let rightHeight = 0

  for (const item of items) {
    const weight = item.heightWeight > 0 ? item.heightWeight : 1
    if (leftHeight <= rightHeight) {
      left.push(item)
      leftHeight += weight
    } else {
      right.push(item)
      rightHeight += weight
    }
  }

  return { left, right }
}
