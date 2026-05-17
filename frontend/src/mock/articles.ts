import type { ImprintArticle } from '@/types/imprint'
import { mockAuthors } from './authors'
import { MOCK_IMAGES } from './constants'

const defaultAuthor = mockAuthors[0]!

export const mockArticles: ImprintArticle[] = [
  {
    id: '1',
    title: '雪山之巅的凝视',
    content:
      '清晨的第一缕阳光穿过云层，落在皑皑白雪之上。站在海拔四千米的山脊，世界仿佛只剩下风声与心跳。',
    meta: '2024年5月16日 · 四川·稻城亚丁',
    images: [
      MOCK_IMAGES.mountain,
      MOCK_IMAGES.portrait,
      MOCK_IMAGES.mountain,
      MOCK_IMAGES.portrait,
    ],
    author: defaultAuthor,
  },
  {
    id: '2',
    title: '雾松小径',
    content: '薄雾沿着松林缓缓流动，石径只容一人通过。脚步声被苔藓吸收，只剩下呼吸与快门。',
    meta: '2024年4月2日 · 云南·香格里拉',
    images: [MOCK_IMAGES.portrait, MOCK_IMAGES.mountain],
    author: defaultAuthor,
  },
]

export function getArticleById(id: string): ImprintArticle | undefined {
  return mockArticles.find((a) => a.id === id)
}
