import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMemoryArticleShareApi, fetchMemoryArticleViewApi } from '@/api/memories'
import { getApiErrorMessage } from '@/api/axios'
import type { ImprintArticle } from '@/types/imprint'
import { toImprintArticle } from '../utils'
import { ARTICLE_LOAD_FAIL_TEXT } from '../const'

/** 印记详情页：拉取并展示详情数据 */
export function useArticlePage() {
  const route = useRoute()
  const article = ref<ImprintArticle | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  /** 外链 / NFC（/m/:slug）进入，不展示返回 */
  const isGuestEntry = computed(() => Boolean(route.meta.guestEntry))

  /** 是否展示返回按钮（仅 App 内从列表等入口进入） */
  const showBack = computed(() => !isGuestEntry.value)

  const loadKey = computed(() => {
    if (isGuestEntry.value) {
      return String(route.params.slug ?? '')
    }
    return String(route.params.id ?? '')
  })

  const showAuthorCard = computed(
    () => article.value?.author.showCardOnGuestPage !== false,
  )

  async function loadArticle(key: string) {
    if (!key) {
      article.value = null
      errorMessage.value = ARTICLE_LOAD_FAIL_TEXT
      return
    }

    loading.value = true
    errorMessage.value = null
    article.value = null

    try {
      const dto = isGuestEntry.value
        ? await fetchMemoryArticleShareApi(key)
        : await fetchMemoryArticleViewApi(key)
      article.value = toImprintArticle(dto)
    } catch (error: unknown) {
      errorMessage.value = getApiErrorMessage(error, ARTICLE_LOAD_FAIL_TEXT)
    } finally {
      loading.value = false
    }
  }

  watch(
    loadKey,
    (key) => {
      void loadArticle(key)
    },
    { immediate: true },
  )

  return {
    article,
    loading,
    errorMessage,
    showBack,
    showAuthorCard,
    reload: () => loadArticle(loadKey.value),
  }
}
