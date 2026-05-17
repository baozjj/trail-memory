import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mockImprintList } from '@/mock'
import type { ImprintListItem } from '@/types/imprint'

export const useImprintStore = defineStore('imprint', () => {
  const items = ref<ImprintListItem[]>([...mockImprintList])
  const searchKeyword = ref('')

  const filteredItems = computed(() => {
    const kw = searchKeyword.value.trim().toLowerCase()
    if (!kw) return items.value
    return items.value.filter((item) => item.title.toLowerCase().includes(kw))
  })

  const isEmpty = computed(() => items.value.length === 0)

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
  }

  function clearAll() {
    items.value = []
  }

  function restoreMockList() {
    items.value = [...mockImprintList]
  }

  return {
    items,
    searchKeyword,
    filteredItems,
    isEmpty,
    setSearchKeyword,
    clearAll,
    restoreMockList,
  }
})
