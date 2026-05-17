import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useImprintStore } from '@/stores/imprint'
import type { TabKey } from '@/components/layout/floating-tab-bar/types'

export function useHomePage() {
  const router = useRouter()
  const imprintStore = useImprintStore()
  const { filteredItems, isEmpty } = storeToRefs(imprintStore)

  const searchKeyword = computed({
    get: () => imprintStore.searchKeyword,
    set: (value: string) => imprintStore.setSearchKeyword(value),
  })

  function onSelect(id: string) {
    router.push({ name: 'article', params: { id } })
  }

  function onTabChange(tab: TabKey) {
    if (tab === 'user') {
      imprintStore.restoreMockList()
    }
  }

  return {
    router,
    imprintStore,
    filteredItems,
    isEmpty,
    searchKeyword,
    onSelect,
    onTabChange,
  }
}
