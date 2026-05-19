import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchMeApi, loginApi, registerApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/axios'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'
import { useProfileStore } from '@/stores/profile'
import { getToken, removeToken, setToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const bootstrapped = ref(false)

  const isLoggedIn = computed(() => Boolean(user.value && getToken()))

  /** 将登录态写入 store 与 localStorage */
  function applySession(token: string, nextUser: AuthUser) {
    setToken(token)
    user.value = nextUser
    const profile = syncProfileFromUser()
    if (profile) {
      useProfileStore().applyFromAuth(profile)
    }
  }

  /** 应用启动时根据 token 恢复用户 */
  async function bootstrap(): Promise<void> {
    if (bootstrapped.value) return
    bootstrapped.value = true

    const token = getToken()
    if (!token) return

    try {
      user.value = await fetchMeApi()
      const profile = syncProfileFromUser()
      if (profile) {
        useProfileStore().applyFromAuth(profile)
      }
    } catch {
      removeToken()
      user.value = null
    }
  }

  /** 登录 */
  async function login(payload: LoginPayload): Promise<void> {
    const session = await loginApi(payload)
    applySession(session.token, session.user)
  }

  /** 注册（可能无 token，需邮箱验证时） */
  async function register(payload: RegisterPayload): Promise<{ needEmailVerification: boolean }> {
    const result = await registerApi(payload)
    if (result.token) {
      applySession(result.token, result.user)
    } else {
      user.value = result.user
    }
    return { needEmailVerification: result.needEmailVerification }
  }

  /** 退出登录 */
  function logout() {
    removeToken()
    user.value = null
  }

  /** 将后端用户同步到个人资料展示 */
  function syncProfileFromUser() {
    if (!user.value) return
    return {
      nickname: user.value.nickname,
      signature: user.value.signature,
      avatarUrl: user.value.avatarUrl,
      showCardOnGuestPage: user.value.showCardOnGuestPage,
    }
  }

  /** 统一错误文案 */
  function resolveError(error: unknown, fallback: string): string {
    return getApiErrorMessage(error, fallback)
  }

  return {
    user,
    bootstrapped,
    isLoggedIn,
    bootstrap,
    login,
    register,
    logout,
    syncProfileFromUser,
    resolveError,
  }
})
