import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/stores/auth'
import { LOGIN_FAIL_FALLBACK } from '../const'

/** 登录页表单与提交逻辑 */
export function useLoginPage() {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)

  async function onSubmit() {
    if (loading.value) return
    loading.value = true
    try {
      await authStore.login({
        email: email.value.trim(),
        password: password.value,
      })
      Toast({ message: '登录成功' })
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      await router.replace(redirect)
    } catch (error) {
      Toast({ message: authStore.resolveError(error, LOGIN_FAIL_FALLBACK) })
    } finally {
      loading.value = false
    }
  }

  function goRegister() {
    void router.push({ name: 'register' })
  }

  return { email, password, loading, onSubmit, goRegister }
}
