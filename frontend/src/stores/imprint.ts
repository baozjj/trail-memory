import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  deleteMemoryApi,
  fetchMemoriesApi,
  patchMemoryApi,
} from '@/api/memories'
import { resolveImprintTypeCoverSrc } from '@/config/imprint-types'
import { mockImprintList } from '@/mock'
import { buildImprintShareLink } from '@/utils/imprint-link'
import { sortImprintsByCreatedAtDesc } from '@/utils/imprint-list-sort'
import type { ImprintListItem } from '@/types/imprint'

export type ImprintListPatch = Partial<
  Pick<ImprintListItem, 'title' | 'isPublic' | 'linkSuffix' | 'typeId'>
>

export type ExhibitSettingsPatch = Pick<ImprintListItem, 'isPublic' | 'linkSuffix'>

export const useImprintStore = defineStore('imprint', () => {
  const items = ref<ImprintListItem[]>([])
  const searchKeyword = ref('')
  const loading = ref(false)
  const loaded = ref(false)

  const filteredItems = computed(() => {
    const kw = searchKeyword.value.trim().toLowerCase()
    const list = kw
      ? items.value.filter((item) => item.title.toLowerCase().includes(kw))
      : items.value
    return sortImprintsByCreatedAtDesc(list)
  })

  const isEmpty = computed(() => !loading.value && items.value.length === 0)

  const isSearchNoResult = computed(() => {
    const kw = searchKeyword.value.trim()
    return kw.length > 0 && items.value.length > 0 && filteredItems.value.length === 0
  })

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
  }

  function getById(id: string): ImprintListItem | undefined {
    return items.value.find((item) => item.id === id)
  }

  /** 仅更新本地 state（发布页 Mock 等场景） */
  function patchItem(id: string, patch: ImprintListPatch) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index === -1) return
    const current = items.value[index]!
    if (patch.title !== undefined) current.title = patch.title
    if (patch.isPublic !== undefined) current.isPublic = patch.isPublic
    if (patch.linkSuffix !== undefined) current.linkSuffix = patch.linkSuffix
    if (patch.typeId !== undefined) current.typeId = patch.typeId
  }

  function replaceItem(updated: ImprintListItem) {
    if (!updated?.id) return
    const index = items.value.findIndex((item) => item.id === updated.id)
    if (index === -1) {
      items.value.unshift(updated)
      return
    }
    items.value[index] = updated
  }

  /** 从后端拉取列表 */
  async function fetchList() {
    loading.value = true
    try {
      items.value = await fetchMemoriesApi()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  /** 保存展出设置并同步本地 */
  async function updateExhibitSettings(id: string, patch: ExhibitSettingsPatch) {
    const updated = await patchMemoryApi(id, patch)
    replaceItem(updated)
    return updated
  }

  /** 删除印记 */
  async function removeItem(id: string) {
    await deleteMemoryApi(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  function createItem(
    payload: Pick<ImprintListItem, 'title' | 'isPublic'> &
      Partial<Pick<ImprintListItem, 'coverUrl' | 'typeId' | 'heightWeight' | 'linkSuffix'>>,
  ): ImprintListItem {
    const id = String(Date.now())
    const linkSuffix =
      payload.linkSuffix ?? Math.random().toString(36).slice(2, 8)
    const typeId = payload.typeId ?? null
    const item: ImprintListItem = {
      id,
      title: payload.title,
      typeId,
      coverUrl: payload.coverUrl ?? resolveImprintTypeCoverSrc(typeId) ?? '',
      isPublic: payload.isPublic,
      linkSuffix,
      heightWeight: payload.heightWeight ?? 1,
      meta: '',
      createdAt: new Date().toISOString(),
    }
    items.value = sortImprintsByCreatedAtDesc([item, ...items.value])
    return item
  }

  function getShareLink(id: string): string | null {
    const item = getById(id)
    if (!item) return null
    return buildImprintShareLink(item)
  }

  function clearAll() {
    items.value = []
    loaded.value = false
  }

  function restoreMockList() {
    items.value = [...mockImprintList]
    loaded.value = true
  }

  return {
    items,
    searchKeyword,
    loading,
    loaded,
    filteredItems,
    isEmpty,
    isSearchNoResult,
    setSearchKeyword,
    getById,
    patchItem,
    replaceItem,
    fetchList,
    updateExhibitSettings,
    removeItem,
    createItem,
    getShareLink,
    clearAll,
    restoreMockList,
  }
})
