import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mockImprintList } from '@/mock'
import { buildImprintShareLink } from '@/utils/imprint-link'
import type { ImprintListItem } from '@/types/imprint'

export type ImprintListPatch = Partial<Pick<ImprintListItem, 'title' | 'isPublic' | 'linkSuffix'>>

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

  function getById(id: string): ImprintListItem | undefined {
    return items.value.find((item) => item.id === id)
  }

  function updateItem(id: string, patch: ImprintListPatch) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index === -1) return
    const current = items.value[index]!
    if (patch.title !== undefined) current.title = patch.title
    if (patch.isPublic !== undefined) current.isPublic = patch.isPublic
    if (patch.linkSuffix !== undefined) current.linkSuffix = patch.linkSuffix
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function getShareLink(id: string): string | null {
    const item = getById(id)
    if (!item) return null
    return buildImprintShareLink(item)
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
    getById,
    updateItem,
    removeItem,
    getShareLink,
    clearAll,
    restoreMockList,
  }
})
