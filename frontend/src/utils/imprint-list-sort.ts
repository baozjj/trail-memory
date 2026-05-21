import type { ImprintListItem } from '@/types/imprint'

/** 按加入时间倒序（最新在前） */
export function sortImprintsByCreatedAtDesc(items: ImprintListItem[]): ImprintListItem[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
