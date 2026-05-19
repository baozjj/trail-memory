import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'tdesign-mobile-vue'
import { getApiErrorMessage } from '@/api/axios'
import { useImprintStore } from '@/stores/imprint'
import type { TabKey } from '@/components/layout/floating-tab-bar/types'
import type { CardActionKey } from '@/components/imprint/card-action-sheet/types'
import type { ExhibitSettingsPayload } from '@/components/imprint/exhibit-settings-sheet/types'
import { copyTextToClipboard } from '@/utils/clipboard'
import { buildImprintShareLink } from '@/utils/imprint-link'

export function useHomePage() {
  const router = useRouter()
  const imprintStore = useImprintStore()
  const { filteredItems, isEmpty, loading } = storeToRefs(imprintStore)

  const searchKeyword = computed({
    get: () => imprintStore.searchKeyword,
    set: (value: string) => imprintStore.setSearchKeyword(value),
  })

  const actionSheetVisible = ref(false)
  const exhibitSheetVisible = ref(false)
  const activeItemId = ref<string | null>(null)

  const activeItem = computed(() => {
    if (!activeItemId.value) return null
    return imprintStore.getById(activeItemId.value) ?? null
  })

  onMounted(() => {
    void imprintStore.fetchList().catch((error: unknown) => {
      Toast({ message: getApiErrorMessage(error, '加载印记列表失败') })
    })
  })

  function onSelect(id: string) {
    router.push({ name: 'article', params: { id } })
  }

  function onCardMore(id: string) {
    activeItemId.value = id
    actionSheetVisible.value = true
  }

  async function copyLinkForItem(id: string) {
    const link = imprintStore.getShareLink(id)
    if (!link) return
    const ok = await copyTextToClipboard(link)
    Toast({ message: ok ? '复制成功' : '复制失败，请重试' })
  }

  function onCardAction(key: CardActionKey) {
    const id = activeItemId.value
    if (!id) return

    switch (key) {
      case 'copy':
        void copyLinkForItem(id)
        break
      case 'exhibit':
        exhibitSheetVisible.value = true
        break
      case 'edit':
        router.push({ name: 'publish', query: { id } })
        break
      case 'delete':
        Dialog.confirm({
          title: '确认删除',
          content: '删除后无法恢复，确定要删除这条印记吗？',
          confirmBtn: '确认',
          cancelBtn: '取消',
          onConfirm: () => {
            void (async () => {
              try {
                await imprintStore.removeItem(id)
                activeItemId.value = null
                Toast({ message: '已删除' })
              } catch (error: unknown) {
                Toast({ message: getApiErrorMessage(error, '删除失败') })
              }
            })()
          },
        })
        break
    }
  }

  async function onExhibitSave(payload: ExhibitSettingsPayload) {
    const id = activeItemId.value
    if (!id) return

    try {
      const item = await imprintStore.updateExhibitSettings(id, payload)
      exhibitSheetVisible.value = false

      const link = buildImprintShareLink(item)
      const ok = await copyTextToClipboard(link)
      Toast({
        message: ok ? '设置已保存，新链接已复制' : '设置已保存，复制失败请手动复制',
      })
    } catch (error: unknown) {
      Toast({ message: getApiErrorMessage(error, '保存失败') })
    }
  }

  function onTabChange(tab: TabKey) {
    if (tab === 'user') {
      router.push({ name: 'profile' })
    }
  }

  return {
    filteredItems,
    isEmpty,
    loading,
    searchKeyword,
    actionSheetVisible,
    exhibitSheetVisible,
    activeItem,
    onSelect,
    onCardMore,
    onCardAction,
    onExhibitSave,
    onTabChange,
  }
}
