import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import {
  fetchMemoryDetail,
  forceUnpublishMemory,
  listMemories,
  softDeleteMemory,
} from '@/api/memories'
import { listImprintTypes } from '@/api/imprint-types'
import { getApiErrorMessage } from '@/api/http'
import { useAdminAuthStore } from '@/stores/admin-auth'
import type { MemoryDetail, MemoryListItem } from '../types'

export function useMemoriesPage() {
  const route = useRoute()
  const authStore = useAdminAuthStore()
  const canWrite = computed(() => authStore.admin?.role !== 'VIEWER')

  const loading = ref(false)
  const items = ref<MemoryListItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const filters = reactive({
    q: '',
    userEmail: '',
    publicFilter: '' as '' | 'true' | 'false',
    typeId: '',
    hasDeleted: false,
    dateRange: [] as string[],
  })

  const drawerVisible = ref(false)
  const drawerLoading = ref(false)
  const detail = ref<MemoryDetail | null>(null)
  const contentExpanded = ref(false)

  const imageViewerVisible = ref(false)
  const imageViewerIndex = ref(0)
  const typeOptions = ref([{ value: '', label: '全部类型' }])

  function buildQueryParams() {
    const params: Parameters<typeof listMemories>[0] = {
      page: page.value,
      pageSize: pageSize.value,
    }
    const q = filters.q.trim()
    if (q) params.q = q
    const email = filters.userEmail.trim()
    if (email) params.userEmail = email
    if (filters.publicFilter === 'true') params.isPublic = true
    if (filters.publicFilter === 'false') params.isPublic = false
    if (filters.typeId) params.typeId = filters.typeId
    if (filters.hasDeleted) params.hasDeleted = true
    if (filters.dateRange[0]) params.createdFrom = filters.dateRange[0]
    if (filters.dateRange[1]) params.createdTo = filters.dateRange[1]
    return params
  }

  async function loadList() {
    loading.value = true
    try {
      const data = await listMemories(buildQueryParams())
      items.value = data.items
      total.value = data.total
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载印记列表失败'))
    } finally {
      loading.value = false
    }
  }

  function search() {
    page.value = 1
    void loadList()
  }

  function resetFilters() {
    filters.q = ''
    filters.userEmail = ''
    filters.publicFilter = ''
    filters.typeId = ''
    filters.hasDeleted = false
    filters.dateRange = []
    search()
  }

  async function openDetail(row: MemoryListItem) {
    drawerVisible.value = true
    drawerLoading.value = true
    contentExpanded.value = false
    detail.value = null
    try {
      detail.value = await fetchMemoryDetail(row.id)
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载印记详情失败'))
      drawerVisible.value = false
    } finally {
      drawerLoading.value = false
    }
  }

  async function refreshDetail() {
    if (!detail.value) return
    detail.value = await fetchMemoryDetail(detail.value.id)
    await loadList()
  }

  function confirmUnpublish(row: Pick<MemoryListItem, 'id' | 'title' | 'isPublic'>) {
    if (!row.isPublic) {
      MessagePlugin.info('该印记已是私密状态')
      return
    }
    const dialog = DialogPlugin.confirm({
      header: '强制下架',
      body: `确定强制下架「${row.title}」？下架后分享链接将不可访问。`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await forceUnpublishMemory(row.id)
          MessagePlugin.success('已强制下架')
          dialog.destroy()
          if (detail.value?.id === row.id) await refreshDetail()
          else await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function confirmDelete(row: Pick<MemoryListItem, 'id' | 'title' | 'deletedAt'>) {
    if (row.deletedAt) {
      MessagePlugin.info('该印记已删除')
      return
    }
    const dialog = DialogPlugin.confirm({
      header: '删除印记',
      body: `确定软删除「${row.title}」？删除后 C 端列表与分享均不可见。`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await softDeleteMemory(row.id)
          MessagePlugin.success('已删除')
          dialog.destroy()
          if (detail.value?.id === row.id) {
            drawerVisible.value = false
          }
          await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '删除失败'))
        }
      },
    })
  }

  async function copyShareSlug(slug: string) {
    try {
      await navigator.clipboard.writeText(slug)
      MessagePlugin.success('分享 slug 已复制')
    } catch {
      MessagePlugin.error('复制失败，请手动复制')
    }
  }

  function openImageViewer(index: number) {
    imageViewerIndex.value = index
    imageViewerVisible.value = true
  }

  async function loadTypeOptions() {
    try {
      const types = await listImprintTypes()
      typeOptions.value = [
        { value: '', label: '全部类型' },
        ...types.map((t) => ({ value: t.id, label: t.label })),
      ]
    } catch {
      // 筛选降级：无类型选项时仍可查询
    }
  }

  onMounted(() => {
    if (typeof route.query.userEmail === 'string' && route.query.userEmail) {
      filters.userEmail = route.query.userEmail
    }
    void loadTypeOptions()
    void loadList()
  })

  return {
    canWrite,
    loading,
    items,
    total,
    page,
    pageSize,
    filters,
    loadList,
    search,
    resetFilters,
    drawerVisible,
    drawerLoading,
    detail,
    contentExpanded,
    imageViewerVisible,
    imageViewerIndex,
    openDetail,
    confirmUnpublish,
    confirmDelete,
    copyShareSlug,
    typeOptions,
    openImageViewer,
  }
}
