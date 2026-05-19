import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'tdesign-mobile-vue'
import { useImprintStore } from '@/stores/imprint'
import { useProfileStore } from '@/stores/profile'
import type { TabKey } from '@/components/layout/floating-tab-bar/types'
import {
  LOGOUT_DIALOG_CONTENT,
  LOGOUT_DIALOG_TITLE,
  LOGOUT_SUCCESS_TOAST,
} from '../const'

export function useProfilePage() {
  const router = useRouter()
  const imprintStore = useImprintStore()
  const profileStore = useProfileStore()

  const { nickname, signature, avatarUrl, showCardOnGuestPage } = storeToRefs(profileStore)
  const sealedCount = computed(() => imprintStore.items.length)

  const showCard = computed({
    get: () => showCardOnGuestPage.value,
    set: (value: boolean) => profileStore.setShowCardOnGuestPage(value),
  })

  function onSignatureUpdate(value: string) {
    profileStore.setSignature(value)
  }

  function onTabChange(tab: TabKey) {
    if (tab === 'grid') {
      router.push({ name: 'home' })
    }
  }

  function onLogout() {
    Dialog.confirm({
      title: LOGOUT_DIALOG_TITLE,
      content: LOGOUT_DIALOG_CONTENT,
      confirmBtn: '退出',
      cancelBtn: '取消',
      onConfirm: () => {
        profileStore.restoreMockProfile()
        Toast({ message: LOGOUT_SUCCESS_TOAST })
        router.push({ name: 'home' })
      },
    })
  }

  return {
    nickname,
    signature,
    avatarUrl,
    sealedCount,
    showCard,
    onSignatureUpdate,
    onTabChange,
    onLogout,
  }
}
