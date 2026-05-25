import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPublicImprintTypes } from '@/api/imprint-types'
import type { ImprintTypeDefinition } from '@/config/imprint-types/types'
import { IMPRINT_TYPE_REGISTRY } from '@/config/imprint-types/registry'

export const useImprintTypesStore = defineStore('imprint-types', () => {
  const enabledItems = ref<ImprintTypeDefinition[]>([])
  const loaded = ref(false)
  const loadError = ref(false)

  async function fetchTypes() {
    try {
      enabledItems.value = await fetchPublicImprintTypes()
      loadError.value = false
    } catch {
      enabledItems.value = [...IMPRINT_TYPE_REGISTRY]
      loadError.value = true
    } finally {
      loaded.value = true
    }
  }

  return {
    enabledItems,
    loaded,
    loadError,
    fetchTypes,
  }
})
