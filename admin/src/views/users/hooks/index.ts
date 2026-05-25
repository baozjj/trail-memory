import { computed, onMounted, reactive, ref } from 'vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import {
  fetchUserDetail,
  listUserMemories,
  listUsers,
  updateUser,
} from '@/api/users'
import { getApiErrorMessage } from '@/api/http'
import { useAdminAuthStore } from '@/stores/admin-auth'
import type { UserDetail, UserListItem, UserMemoryItem, UserStatus } from '../types'

type UserActionTarget = Pick<
  UserListItem,
  'id' | 'email' | 'nickname' | 'status' | 'isVerified'
>

export function useUsersPage() {
  const authStore = useAdminAuthStore()
  const canWrite = computed(() => authStore.admin?.role !== 'VIEWER')

  const loading = ref(false)
  const items = ref<UserListItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const filters = reactive({
    q: '',
    verifyFilter: '' as '' | 'true' | 'false',
    statusFilter: '' as '' | UserStatus,
    dateRange: [] as string[],
  })

  const drawerVisible = ref(false)
  const drawerLoading = ref(false)
  const detail = ref<UserDetail | null>(null)
  const memoryItems = ref<UserMemoryItem[]>([])
  const memoryTotal = ref(0)
  const memoryPage = ref(1)
  const memoryPageSize = ref(10)

  function buildQueryParams() {
    const params: Parameters<typeof listUsers>[0] = {
      page: page.value,
      pageSize: pageSize.value,
    }
    const q = filters.q.trim()
    if (q) params.q = q
    if (filters.verifyFilter === 'true') params.isVerified = true
    if (filters.verifyFilter === 'false') params.isVerified = false
    if (filters.statusFilter) params.status = filters.statusFilter
    if (filters.dateRange[0]) params.createdFrom = filters.dateRange[0]
    if (filters.dateRange[1]) params.createdTo = filters.dateRange[1]
    return params
  }

  async function loadList() {
    loading.value = true
    try {
      const data = await listUsers(buildQueryParams())
      items.value = data.items
      total.value = data.total
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载用户列表失败'))
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
    filters.verifyFilter = ''
    filters.statusFilter = ''
    filters.dateRange = []
    search()
  }

  async function loadMemories(userId: string) {
    try {
      const data = await listUserMemories(userId, {
        page: memoryPage.value,
        pageSize: memoryPageSize.value,
      })
      memoryItems.value = data.items
      memoryTotal.value = data.total
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载印记列表失败'))
    }
  }

  async function openDetail(row: UserListItem) {
    drawerVisible.value = true
    drawerLoading.value = true
    detail.value = null
    memoryPage.value = 1
    try {
      detail.value = await fetchUserDetail(row.id)
      await loadMemories(row.id)
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载用户详情失败'))
      drawerVisible.value = false
    } finally {
      drawerLoading.value = false
    }
  }

  async function refreshDetail() {
    if (!detail.value) return
    detail.value = await fetchUserDetail(detail.value.id)
    await loadMemories(detail.value.id)
    await loadList()
  }

  function confirmBan(row: UserActionTarget) {
    const dialog = DialogPlugin.confirm({
      header: '禁用用户',
      body: `确定禁用「${row.nickname}」（${row.email}）？禁用后该用户将无法登录。`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await updateUser(row.id, { status: 'BANNED' })
          MessagePlugin.success('已禁用')
          dialog.destroy()
          if (detail.value?.id === row.id) await refreshDetail()
          else await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function confirmUnban(row: UserActionTarget) {
    const dialog = DialogPlugin.confirm({
      header: '启用用户',
      body: `确定启用「${row.nickname}」？`,
      onConfirm: async () => {
        try {
          await updateUser(row.id, { status: 'ACTIVE' })
          MessagePlugin.success('已启用')
          dialog.destroy()
          if (detail.value?.id === row.id) await refreshDetail()
          else await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function confirmVerify(row: UserActionTarget) {
    const dialog = DialogPlugin.confirm({
      header: '标记已验证',
      body: `确定将「${row.nickname}」的邮箱标记为已验证？`,
      onConfirm: async () => {
        try {
          await updateUser(row.id, { isVerified: true })
          MessagePlugin.success('已标记为已验证')
          dialog.destroy()
          if (detail.value?.id === row.id) await refreshDetail()
          else await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function onMemoryPageChange(p: { current: number; pageSize: number }) {
    memoryPage.value = p.current
    memoryPageSize.value = p.pageSize
    if (detail.value) void loadMemories(detail.value.id)
  }

  onMounted(() => {
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
    memoryItems,
    memoryTotal,
    memoryPage,
    memoryPageSize,
    openDetail,
    confirmBan,
    confirmUnban,
    confirmVerify,
    onMemoryPageChange,
  }
}
