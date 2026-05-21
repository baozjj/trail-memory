import { resolveImprintTypeCoverSrc } from '@/config/imprint-types'
import type { ImprintListItem } from '@/types/imprint'

function mockItem(
  partial: Omit<ImprintListItem, 'coverUrl'> & { coverUrl?: string },
): ImprintListItem {
  const typeId = partial.typeId ?? null
  return {
    ...partial,
    typeId,
    coverUrl: partial.coverUrl ?? resolveImprintTypeCoverSrc(typeId) ?? '',
  }
}

export const mockImprintList: ImprintListItem[] = [
  mockItem({
    id: '1',
    title: '晨曦山脊',
    typeId: 'xihu-biaoyi',
    heightWeight: 1.15,
    isPublic: true,
    linkSuffix: 'chenxi',
    meta: '2024年5月16日 · 浙江·杭州',
  }),
  mockItem({
    id: '2',
    title: '雾松小径',
    typeId: null,
    heightWeight: 0.92,
    isPublic: true,
    linkSuffix: 'wusong',
    meta: '2024年4月2日 · 云南·香格里拉',
  }),
  mockItem({
    id: '3',
    title: '静湖倒映',
    typeId: 'xihu-biaoyi',
    heightWeight: 1.28,
    isPublic: false,
    linkSuffix: 'jinghu',
    meta: '2024年3月21日 · 浙江·杭州',
  }),
  mockItem({
    id: '4',
    title: '金色沙丘',
    typeId: null,
    heightWeight: 1.05,
    isPublic: true,
    linkSuffix: 'shamo',
    meta: '2024年2月8日 · 甘肃·敦煌',
  }),
  mockItem({
    id: '5',
    title: '海岸线',
    typeId: 'xihu-biaoyi',
    heightWeight: 0.88,
    isPublic: true,
    linkSuffix: 'coast',
    meta: '2024年1月15日 · 福建·平潭',
  }),
  mockItem({
    id: '6',
    title: '红岩峡谷',
    typeId: null,
    heightWeight: 1.2,
    isPublic: false,
    linkSuffix: 'hongyan',
    meta: '2023年12月3日 · 四川·甘孜',
  }),
]
