import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: { title: '注册', guest: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: { title: '印记首页', requiresAuth: true },
    },
    {
      path: '/empty',
      name: 'empty',
      component: () => import('@/views/empty/index.vue'),
      meta: { title: '空状态', requiresAuth: true },
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/publish/index.vue'),
      meta: { title: '封存印记', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile/index.vue'),
      meta: { title: '个人中心', requiresAuth: true },
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/article/index.vue'),
      meta: { title: '印记详情' },
    },
    {
      path: '/m/:slug',
      name: 'imprint-share',
      component: () => import('@/views/article/index.vue'),
      meta: { title: '印记详情', guestEntry: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const requiresAuth = Boolean(to.meta.requiresAuth)
  const isGuestRoute = Boolean(to.meta.guest)
  const isShareEntry = Boolean(to.meta.guestEntry)
  const hasToken = Boolean(getToken())

  if (requiresAuth && !hasToken) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 登录/注册页：已登录则进首页；NFC 外链详情页不拦截
  if (isGuestRoute && hasToken && !isShareEntry) {
    return { name: 'home' }
  }

  return true
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'Trail Memory'
  document.title = `${title} · 印记`
})

export default router
