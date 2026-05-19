import { MOCK_IMAGES } from './constants'
import type { UserProfile } from '@/types/user'

export const mockUserProfile: UserProfile = {
  nickname: '大伟',
  signature: '一名周末在逃打工人',
  avatarUrl: MOCK_IMAGES.profileAvatar,
  showCardOnGuestPage: true,
}
