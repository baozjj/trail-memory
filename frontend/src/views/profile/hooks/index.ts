import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'tdesign-mobile-vue'
import { fetchMeApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/axios'
import { uploadImagesApi } from '@/api/uploads'
import { useAuthStore } from '@/stores/auth'
import { useImprintStore } from '@/stores/imprint'
import { useProfileStore } from '@/stores/profile'
import { resolveAvatarUrl } from '@/utils/avatar'
import { pickSingleImageFromAlbum } from '@/utils/pick-image'
import type { TabKey } from '@/components/layout/floating-tab-bar/types'
import {
  LOGOUT_DIALOG_CONTENT,
  LOGOUT_DIALOG_TITLE,
  LOGOUT_SUCCESS_TOAST,
} from '../const'

const SIGNATURE_SAVE_DELAY_MS = 600

/** 个人中心页交互 */
export function useProfilePage() {
  const router = useRouter()
  const authStore = useAuthStore()
  const imprintStore = useImprintStore()
  const profileStore = useProfileStore()

  const { nickname, signature, avatarUrl, showCardOnGuestPage } = storeToRefs(profileStore)
  const sealedCount = computed(() => imprintStore.items.length)
  const avatarUploading = ref(false)
  let signatureSaveTimer: ReturnType<typeof setTimeout> | null = null

  const avatarDisplayUrl = computed(() => resolveAvatarUrl(avatarUrl.value))

  const showCard = computed({
    get: () => showCardOnGuestPage.value,
    set: (value: boolean) => {
      profileStore.setShowCardOnGuestPage(value)
      void persistProfile({ showCardOnGuestPage: value }, '设置保存失败')
    },
  })

  onMounted(() => {
    void refreshFromServer()
    if (!imprintStore.loaded) {
      void imprintStore.fetchList()
    }
  })

  /** 从服务端拉取最新资料 */
  async function refreshFromServer() {
    try {
      const user = await fetchMeApi()
      authStore.applyUser(user)
    } catch {
      // 忽略：bootstrap 可能已加载
    }
  }

  /** 持久化资料字段 */
  async function persistProfile(
    payload: Parameters<typeof authStore.updateProfile>[0],
    failMessage: string,
  ) {
    try {
      await authStore.updateProfile(payload)
    } catch (error: unknown) {
      Toast({ message: getApiErrorMessage(error, failMessage) })
    }
  }

  function onSignatureUpdate(value: string) {
    profileStore.setSignature(value)
    if (signatureSaveTimer) clearTimeout(signatureSaveTimer)
    signatureSaveTimer = setTimeout(() => {
      void persistProfile({ signature: value }, '签名保存失败')
    }, SIGNATURE_SAVE_DELAY_MS)
  }

  /** 选择并上传头像 */
  async function onEditAvatar() {
    if (avatarUploading.value) return

    const file = await pickSingleImageFromAlbum()
    if (!file) return

    avatarUploading.value = true
    try {
      const [url] = await uploadImagesApi([file])
      if (!url) {
        Toast({ message: '头像上传失败' })
        return
      }
      await authStore.updateProfile({ avatarUrl: url })
      Toast({ message: '头像已更新' })
    } catch (error: unknown) {
      Toast({ message: getApiErrorMessage(error, '头像更新失败') })
    } finally {
      avatarUploading.value = false
    }
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
        authStore.logout()
        imprintStore.clearAll()
        profileStore.restoreMockProfile()
        Toast({ message: LOGOUT_SUCCESS_TOAST })
        void router.replace({ name: 'login' })
      },
    })
  }

  return {
    nickname,
    signature,
    avatarDisplayUrl,
    avatarUploading,
    sealedCount,
    showCard,
    onSignatureUpdate,
    onEditAvatar,
    onTabChange,
    onLogout,
  }
}
