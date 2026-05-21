import type { ImprintListItem } from '@/types/imprint'

/**
 * 按列表顺序交替分列（0→左、1→右、2→左…），与加入时间序一致。
 * 阅读时同一「行」左右相邻即为时间相邻，避免高度均衡算法打乱顺序感。
 */
export function splitWaterfallColumns(items: ImprintListItem[]) {
  const left: ImprintListItem[] = []
  const right: ImprintListItem[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) left.push(item)
    else right.push(item)
  })
  return { left, right }
}
