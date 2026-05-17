import type { Author } from '@/types/imprint'
import { MOCK_IMAGES } from './constants'

export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    name: '山野旅人',
    bio: '用镜头记录每一次与自然的相遇',
    avatarUrl: MOCK_IMAGES.portrait,
  },
]

export function getAuthorById(id: string): Author | undefined {
  return mockAuthors.find((a) => a.id === id)
}
