import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useAdminAuthStore } from '@/stores/admin-auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', guest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/admin-layout/index.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '运营看板' },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/users/index.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: 'memories',
          name: 'memories',
          component: () => import('@/views/memories/index.vue'),
          meta: { title: '印记管理' },
        },
        {
          path: 'imprint-types',
          name: 'imprint-types',
          component: () => import('@/views/placeholder/index.vue'),
          meta: { title: '印记类型', placeholder: 'M04' },
        },
        {
          path: 'media',
          name: 'media',
          component: () => import('@/views/placeholder/index.vue'),
          meta: { title: '媒体资源', placeholder: 'M05' },
        },
        {
          path: 'audit-logs',
          name: 'audit-logs',
          component: () => import('@/views/placeholder/index.vue'),
          meta: { title: '操作审计', placeholder: 'M07' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/placeholder/index.vue'),
          meta: { title: '系统配置', placeholder: 'M08' },
        },
        {
          path: 'admins',
          name: 'admins',
          component: () => import('@/views/admins/index.vue'),
          meta: { title: '管理员', superAdminOnly: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'dashboard' },
    },
  ],
})

router.beforeEach(async (to) => {
  const isGuest = Boolean(to.meta.guest)
  const requiresAuth = Boolean(to.meta.requiresAuth) || to.matched.some((r) => r.meta.requiresAuth)
  const hasToken = Boolean(getToken())

  if (requiresAuth && !hasToken) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (isGuest && hasToken) {
    return { name: 'dashboard' }
  }

  if (requiresAuth && hasToken) {
    const authStore = useAdminAuthStore()
    if (!authStore.admin) {
      try {
        await authStore.fetchMe()
      } catch {
        authStore.logout()
        return { name: 'login', query: { redirect: to.fullPath } }
      }
    }

    if (to.meta.superAdminOnly && authStore.admin?.role !== 'SUPER_ADMIN') {
      return { name: 'dashboard' }
    }
  }

  return true
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? '管理后台'
  document.title = `${title} · Trail Memory`
})

export default router
