import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAdminMe, loginAdmin, type LoginPayload } from '@/api/auth'
import type { AdminProfile } from '@/types/admin'
import { getToken, removeToken, setToken } from '@/utils/auth'

export const useAdminAuthStore = defineStore('admin-auth', () => {
  const admin = ref<AdminProfile | null>(null)
  const loading = ref(false)

  const isLoggedIn = () => Boolean(getToken())

  async function login(payload: LoginPayload) {
    const result = await loginAdmin(payload)
    setToken(result.token)
    admin.value = result.admin
    return result
  }

  async function fetchMe() {
    if (!getToken()) {
      admin.value = null
      return null
    }
    loading.value = true
    try {
      admin.value = await fetchAdminMe()
      return admin.value
    } finally {
      loading.value = false
    }
  }

  function logout() {
    removeToken()
    admin.value = null
  }

  return {
    admin,
    loading,
    isLoggedIn,
    login,
    fetchMe,
    logout,
  }
})
