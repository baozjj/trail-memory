import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/stores/auth'
import {
  REGISTER_FAIL_FALLBACK,
  VERIFY_EMAIL_TOAST,
} from '../const'

/** 注册页表单与提交逻辑 */
export function useRegisterPage() {
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)

  async function onSubmit() {
    if (loading.value) return
    loading.value = true
    try {
      const { needEmailVerification } = await authStore.register({
        email: email.value.trim(),
        password: password.value,
      })

      if (needEmailVerification) {
        Toast({ message: VERIFY_EMAIL_TOAST })
        await router.replace({ name: 'login' })
        return
      }

      Toast({ message: '注册成功' })
      await router.replace({ name: 'home' })
    } catch (error) {
      Toast({ message: authStore.resolveError(error, REGISTER_FAIL_FALLBACK) })
    } finally {
      loading.value = false
    }
  }

  function goLogin() {
    void router.push({ name: 'login' })
  }

  return { email, password, loading, onSubmit, goLogin }
}
