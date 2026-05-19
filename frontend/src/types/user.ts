export interface UserProfile {
  nickname: string
  signature: string
  avatarUrl: string
  /** 在游客页展示我的名片 */
  showCardOnGuestPage: boolean
}
