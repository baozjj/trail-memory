import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue'),
      meta: { title: '印记首页' },
    },
    {
      path: '/empty',
      name: 'empty',
      component: () => import('@/views/home/EmptyHomeView.vue'),
      meta: { title: '空状态' },
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/publish/PublishView.vue'),
      meta: { title: '封存印记' },
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/article/ArticleDetailView.vue'),
      meta: { title: '印记详情' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'Trail Memory'
  document.title = `${title} · 印记`
})

export default router
