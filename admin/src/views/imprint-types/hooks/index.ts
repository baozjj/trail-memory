import { computed, onMounted, reactive, ref, watch } from 'vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import {
  confirmImprintCover,
  createImprintType,
  listImprintTypes,
  processImprintCover,
  updateImprintType,
} from '@/api/imprint-types'
import { getApiErrorMessage } from '@/api/http'
import { useAdminAuthStore } from '@/stores/admin-auth'
import type { CreateImprintTypePayload, ImprintCoverPreview, ImprintTypeItem } from '../types'

const emptyForm = (): CreateImprintTypePayload => ({
  id: '',
  label: '',
  coverPath: '',
  sortOrder: 0,
  enabled: true,
})

export function useImprintTypesPage() {
  const authStore = useAdminAuthStore()
  const canWrite = computed(() => authStore.admin?.role !== 'VIEWER')

  const loading = ref(false)
  const items = ref<ImprintTypeItem[]>([])

  const filters = reactive({
    q: '',
    enabledFilter: '' as '' | 'true' | 'false',
  })

  const drawerVisible = ref(false)
  const drawerMode = ref<'create' | 'edit'>('create')
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const form = reactive(emptyForm())

  const coverFile = ref<File | null>(null)
  const coverProcessing = ref(false)
  const coverConfirming = ref(false)
  const coverPreview = ref<ImprintCoverPreview | null>(null)
  const coverConfirmed = ref(false)

  const coverPreviewSrc = computed(() => {
    if (coverPreview.value?.previewBase64) return coverPreview.value.previewBase64
    if (form.coverPath) return form.coverPath
    return ''
  })

  const canConfirmCover = computed(
    () => !!coverPreview.value && !coverConfirmed.value && !coverProcessing.value,
  )

  const coverNeedsConfirm = computed(
    () => drawerMode.value === 'create' && !!coverPreview.value && !coverConfirmed.value,
  )

  function resetCoverState() {
    coverFile.value = null
    coverProcessing.value = false
    coverConfirming.value = false
    coverPreview.value = null
    coverConfirmed.value = false
  }

  function syncSuggestedCoverPath() {
    const id = form.id.trim()
    if (!id) return
    if (coverConfirmed.value || coverPreview.value) return
    form.coverPath = `/imprint-types/${id}.png`
  }

  watch(
    () => form.id,
    () => {
      syncSuggestedCoverPath()
    },
  )

  async function loadList() {
    loading.value = true
    try {
      const params: { q?: string; enabled?: boolean } = {}
      const q = filters.q.trim()
      if (q) params.q = q
      if (filters.enabledFilter === 'true') params.enabled = true
      if (filters.enabledFilter === 'false') params.enabled = false
      items.value = await listImprintTypes(params)
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '加载印记类型失败'))
    } finally {
      loading.value = false
    }
  }

  function search() {
    void loadList()
  }

  function resetFilters() {
    filters.q = ''
    filters.enabledFilter = ''
    void loadList()
  }

  function openCreate() {
    drawerMode.value = 'create'
    editingId.value = null
    Object.assign(form, emptyForm())
    resetCoverState()
    drawerVisible.value = true
  }

  function openEdit(row: ImprintTypeItem) {
    drawerMode.value = 'edit'
    editingId.value = row.id
    form.id = row.id
    form.label = row.label
    form.coverPath = row.coverPath
    form.sortOrder = row.sortOrder
    form.enabled = row.enabled
    resetCoverState()
    coverConfirmed.value = true
    drawerVisible.value = true
  }

  function onCoverFileChange(file: File | null) {
    coverFile.value = file
    coverPreview.value = null
    coverConfirmed.value = false
  }

  async function processCover() {
    if (!coverFile.value) {
      MessagePlugin.warning('请先选择白底六边形封面原图')
      return
    }

    if (drawerMode.value === 'create' && !form.id.trim()) {
      MessagePlugin.warning('请先填写 ID，以便生成封面路径')
      return
    }

    coverProcessing.value = true
    try {
      const typeId = drawerMode.value === 'create' ? form.id.trim() : editingId.value ?? undefined
      coverPreview.value = await processImprintCover(coverFile.value, typeId)
      form.coverPath = coverPreview.value.suggestedCoverPath
      coverConfirmed.value = false
      MessagePlugin.success('封面已处理，请确认预览效果')
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '封面处理失败'))
    } finally {
      coverProcessing.value = false
    }
  }

  async function confirmCover() {
    if (!coverPreview.value) {
      MessagePlugin.warning('请先上传并处理封面')
      return
    }

    const typeId = drawerMode.value === 'create' ? form.id.trim() : editingId.value
    if (!typeId) {
      MessagePlugin.warning('请先填写 ID')
      return
    }

    coverConfirming.value = true
    try {
      const { coverPath } = await confirmImprintCover(coverPreview.value.token, typeId)
      form.coverPath = coverPath
      coverConfirmed.value = true
      MessagePlugin.success('封面已确认，可以保存类型')
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '封面确认失败'))
    } finally {
      coverConfirming.value = false
    }
  }

  async function submitForm() {
    if (drawerMode.value === 'create') {
      if (!form.id.trim()) {
        MessagePlugin.warning('请填写 ID')
        return
      }
      if (!form.label.trim()) {
        MessagePlugin.warning('请填写名称')
        return
      }
      if (coverNeedsConfirm.value) {
        MessagePlugin.warning('请先确认处理后的封面')
        return
      }
      if (!form.coverPath.trim()) {
        MessagePlugin.warning('请上传并确认封面')
        return
      }
    }

    submitting.value = true
    try {
      if (drawerMode.value === 'create') {
        await createImprintType({
          id: form.id.trim(),
          label: form.label.trim(),
          coverPath: form.coverPath.trim(),
          sortOrder: form.sortOrder,
          enabled: form.enabled,
        })
        MessagePlugin.success('印记类型已创建')
      } else if (editingId.value) {
        if (coverPreview.value && !coverConfirmed.value) {
          MessagePlugin.warning('请先确认新封面，或重新上传处理')
          return
        }
        await updateImprintType(editingId.value, {
          label: form.label.trim(),
          coverPath: form.coverPath.trim(),
          sortOrder: form.sortOrder,
          enabled: form.enabled,
        })
        MessagePlugin.success('印记类型已更新')
      }
      drawerVisible.value = false
      await loadList()
    } catch (err) {
      MessagePlugin.error(getApiErrorMessage(err, '保存失败'))
    } finally {
      submitting.value = false
    }
  }

  function confirmToggleEnabled(row: ImprintTypeItem, enabled: boolean) {
    if (row.enabled === enabled) return

    if (!enabled) {
      const dialog = DialogPlugin.confirm({
        header: '停用印记类型',
        body: `确定停用「${row.label}」？停用后 C 端发布页不可再选，已有印记仍保留类型名称。`,
        theme: 'warning',
        onConfirm: async () => {
          try {
            await updateImprintType(row.id, { enabled: false })
            MessagePlugin.success('已停用')
            dialog.destroy()
            await loadList()
          } catch (err) {
            MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
          }
        },
      })
      return
    }

    void updateImprintType(row.id, { enabled: true })
      .then(() => {
        MessagePlugin.success('已启用')
        return loadList()
      })
      .catch((err) => {
        MessagePlugin.error(getApiErrorMessage(err, '操作失败'))
      })
  }

  onMounted(() => {
    void loadList()
  })

  return {
    canWrite,
    loading,
    items,
    filters,
    drawerVisible,
    drawerMode,
    submitting,
    form,
    coverFile,
    coverProcessing,
    coverConfirming,
    coverPreview,
    coverConfirmed,
    coverPreviewSrc,
    canConfirmCover,
    coverNeedsConfirm,
    search,
    resetFilters,
    openCreate,
    openEdit,
    onCoverFileChange,
    processCover,
    confirmCover,
    submitForm,
    confirmToggleEnabled,
  }
}
