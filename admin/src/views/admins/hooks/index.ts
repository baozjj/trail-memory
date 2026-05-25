import { onMounted, reactive, ref } from 'vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import {
  createAdmin,
  listAdmins,
  resetAdminPassword,
  updateAdmin,
  type CreateAdminPayload,
} from '@/api/admins'
import { getApiErrorMessage } from '@/api/http'
import { useAdminAuthStore } from '@/stores/admin-auth'
import type { AdminListItem, AdminRole } from '@/types/admin'

export function useAdminsPage() {
  const authStore = useAdminAuthStore()
  const loading = ref(false)
  const items = ref<AdminListItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const createVisible = ref(false)
  const createSubmitting = ref(false)
  const createForm = reactive<CreateAdminPayload>({
    email: '',
    password: '',
    displayName: '',
    role: 'OPERATOR',
  })

  const resetVisible = ref(false)
  const resetSubmitting = ref(false)
  const resetTargetId = ref<string | null>(null)
  const resetPassword = ref('')

  async function loadList() {
    loading.value = true
    try {
      const data = await listAdmins({ page: page.value, pageSize: pageSize.value })
      items.value = data.items
      total.value = data.total
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载管理员列表失败'))
    } finally {
      loading.value = false
    }
  }

  function openCreate() {
    createForm.email = ''
    createForm.password = ''
    createForm.displayName = ''
    createForm.role = 'OPERATOR'
    createVisible.value = true
  }

  async function submitCreate() {
    createSubmitting.value = true
    try {
      await createAdmin({ ...createForm })
      MessagePlugin.success('管理员已创建')
      createVisible.value = false
      await loadList()
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '创建失败'))
    } finally {
      createSubmitting.value = false
    }
  }

  function confirmDisable(row: AdminListItem) {
    if (row.id === authStore.admin?.id) {
      MessagePlugin.warning('不能禁用自己的账号')
      return
    }

    const dialog = DialogPlugin.confirm({
      header: '禁用管理员',
      body: `确定禁用「${row.displayName}」（${row.email}）？禁用后将无法登录。`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await updateAdmin(row.id, { status: 'DISABLED' })
          MessagePlugin.success('已禁用')
          dialog.destroy()
          await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function confirmEnable(row: AdminListItem) {
    const dialog = DialogPlugin.confirm({
      header: '启用管理员',
      body: `确定启用「${row.displayName}」？`,
      onConfirm: async () => {
        try {
          await updateAdmin(row.id, { status: 'ACTIVE' })
          MessagePlugin.success('已启用')
          dialog.destroy()
          await loadList()
        } catch (err) {
          MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
        }
      },
    })
  }

  function openResetPassword(row: AdminListItem) {
    resetTargetId.value = row.id
    resetPassword.value = ''
    resetVisible.value = true
  }

  async function submitResetPassword() {
    if (!resetTargetId.value) return
    resetSubmitting.value = true
    try {
      await resetAdminPassword(resetTargetId.value, resetPassword.value)
      MessagePlugin.success('密码已重置')
      resetVisible.value = false
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '重置密码失败'))
    } finally {
      resetSubmitting.value = false
    }
  }

  async function changeRole(row: AdminListItem, role: AdminRole) {
    if (row.role === role) return
    try {
      await updateAdmin(row.id, { role })
      MessagePlugin.success('角色已更新')
      await loadList()
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '更新角色失败'))
    }
  }

  onMounted(() => {
    void loadList()
  })

  return {
    loading,
    items,
    total,
    page,
    pageSize,
    loadList,
    createVisible,
    createSubmitting,
    createForm,
    openCreate,
    submitCreate,
    resetVisible,
    resetSubmitting,
    resetPassword,
    openResetPassword,
    submitResetPassword,
    confirmDisable,
    confirmEnable,
    changeRole,
    currentAdminId: () => authStore.admin?.id,
  }
}
