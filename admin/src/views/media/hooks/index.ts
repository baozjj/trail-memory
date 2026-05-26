import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { fetchMediaReferences, fetchMediaStats, listMedia } from '@/api/media'
import { getApiErrorMessage } from '@/api/http'
import type { MediaListItem, MediaReferences, MediaStats } from '../types'

export function useMediaPage() {
  const router = useRouter()

  const loading = ref(false)
  const statsLoading = ref(false)
  const stats = ref<MediaStats | null>(null)
  const items = ref<MediaListItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const filters = reactive({
    q: '',
    referencedFilter: '' as '' | 'true' | 'false',
  })

  const drawerVisible = ref(false)
  const drawerLoading = ref(false)
  const references = ref<MediaReferences | null>(null)
  const imageViewerVisible = ref(false)

  function buildQueryParams() {
    const params: Parameters<typeof listMedia>[0] = {
      page: page.value,
      pageSize: pageSize.value,
    }
    const q = filters.q.trim()
    if (q) params.q = q
    if (filters.referencedFilter === 'true') params.referenced = true
    if (filters.referencedFilter === 'false') params.referenced = false
    return params
  }

  async function loadStats() {
    statsLoading.value = true
    try {
      stats.value = await fetchMediaStats()
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载存储统计失败'))
    } finally {
      statsLoading.value = false
    }
  }

  async function loadList() {
    loading.value = true
    try {
      const data = await listMedia(buildQueryParams())
      items.value = data.items
      total.value = data.total
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载图片列表失败'))
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    await Promise.all([loadStats(), loadList()])
  }

  function search() {
    page.value = 1
    void loadList()
  }

  function resetFilters() {
    filters.q = ''
    filters.referencedFilter = ''
    page.value = 1
    void loadList()
  }

  async function openDetail(row: MediaListItem) {
    drawerVisible.value = true
    drawerLoading.value = true
    references.value = null
    try {
      references.value = await fetchMediaReferences(row.filename)
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载引用详情失败'))
      drawerVisible.value = false
    } finally {
      drawerLoading.value = false
    }
  }

  function openImageViewer() {
    if (!references.value?.url) return
    imageViewerVisible.value = true
  }

  function goToMemories(userEmail: string) {
    void router.push({ name: 'memories', query: { userEmail } })
  }

  onMounted(() => {
    void refresh()
  })

  return {
    loading,
    statsLoading,
    stats,
    items,
    total,
    page,
    pageSize,
    filters,
    loadList,
    search,
    resetFilters,
    refresh,
    drawerVisible,
    drawerLoading,
    references,
    imageViewerVisible,
    openDetail,
    openImageViewer,
    goToMemories,
  }
}
