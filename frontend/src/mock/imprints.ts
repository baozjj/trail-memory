import type { ImprintListItem } from '@/types/imprint'
import { MOCK_IMAGES } from './constants'

export const mockImprintList: ImprintListItem[] = [
  {
    id: '1',
    title: '晨曦山脊',
    coverUrl: MOCK_IMAGES.mountain,
    heightWeight: 1.15,
    isPublic: true,
    linkSuffix: 'chenxi',
  },
  {
    id: '2',
    title: '雾松小径',
    coverUrl: MOCK_IMAGES.portrait,
    heightWeight: 0.92,
    isPublic: true,
    linkSuffix: 'wusong',
  },
  {
    id: '3',
    title: '静湖倒映',
    coverUrl: MOCK_IMAGES.mountain,
    heightWeight: 1.28,
    isPublic: false,
    linkSuffix: 'jinghu',
  },
  {
    id: '4',
    title: '金色沙丘',
    coverUrl: MOCK_IMAGES.portrait,
    heightWeight: 1.05,
    isPublic: true,
    linkSuffix: 'shamo',
  },
  {
    id: '5',
    title: '海岸线',
    coverUrl: MOCK_IMAGES.mountain,
    heightWeight: 0.88,
    isPublic: true,
    linkSuffix: 'coast',
  },
  {
    id: '6',
    title: '红岩峡谷',
    coverUrl: MOCK_IMAGES.portrait,
    heightWeight: 1.2,
    isPublic: false,
    linkSuffix: 'hongyan',
  },
]
