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
  }),
  mockItem({
    id: '2',
    title: '雾松小径',
    typeId: null,
    heightWeight: 0.92,
    isPublic: true,
    linkSuffix: 'wusong',
  }),
  mockItem({
    id: '3',
    title: '静湖倒映',
    typeId: 'xihu-biaoyi',
    heightWeight: 1.28,
    isPublic: false,
    linkSuffix: 'jinghu',
  }),
  mockItem({
    id: '4',
    title: '金色沙丘',
    typeId: null,
    heightWeight: 1.05,
    isPublic: true,
    linkSuffix: 'shamo',
  }),
  mockItem({
    id: '5',
    title: '海岸线',
    typeId: 'xihu-biaoyi',
    heightWeight: 0.88,
    isPublic: true,
    linkSuffix: 'coast',
  }),
  mockItem({
    id: '6',
    title: '红岩峡谷',
    typeId: null,
    heightWeight: 1.2,
    isPublic: false,
    linkSuffix: 'hongyan',
  }),
]
