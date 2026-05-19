import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUserProfile } from '@/mock'
import type { UserProfile } from '@/types/user'

export const useProfileStore = defineStore('profile', () => {
  const nickname = ref(mockUserProfile.nickname)
  const signature = ref(mockUserProfile.signature)
  const avatarUrl = ref(mockUserProfile.avatarUrl)
  const showCardOnGuestPage = ref(mockUserProfile.showCardOnGuestPage)

  function setSignature(value: string) {
    signature.value = value
  }

  function setAvatarUrl(value: string) {
    avatarUrl.value = value
  }

  function setShowCardOnGuestPage(value: boolean) {
    showCardOnGuestPage.value = value
  }

  /** 从登录用户同步名片字段 */
  function applyFromAuth(profile: UserProfile) {
    nickname.value = profile.nickname
    signature.value = profile.signature
    avatarUrl.value = profile.avatarUrl
    showCardOnGuestPage.value = profile.showCardOnGuestPage
  }

  function restoreMockProfile() {
    nickname.value = mockUserProfile.nickname
    signature.value = mockUserProfile.signature
    avatarUrl.value = mockUserProfile.avatarUrl
    showCardOnGuestPage.value = mockUserProfile.showCardOnGuestPage
  }

  function snapshot(): UserProfile {
    return {
      nickname: nickname.value,
      signature: signature.value,
      avatarUrl: avatarUrl.value,
      showCardOnGuestPage: showCardOnGuestPage.value,
    }
  }

  return {
    nickname,
    signature,
    avatarUrl,
    showCardOnGuestPage,
    setSignature,
    setAvatarUrl,
    setShowCardOnGuestPage,
    applyFromAuth,
    restoreMockProfile,
    snapshot,
  }
})
