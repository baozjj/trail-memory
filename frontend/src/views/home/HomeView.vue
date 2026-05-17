<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import MobilePage from '@/components/layout/MobilePage.vue'
import FloatingTabBar from '@/components/layout/FloatingTabBar.vue'
import ImprintSearchHeader from '@/components/imprint/ImprintSearchHeader.vue'
import WaterfallGrid from '@/components/imprint/WaterfallGrid.vue'
import EmptyImprintState from '@/components/empty/EmptyImprintState.vue'
import { useImprintStore } from '@/stores/imprint'

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

function onTabChange(tab: 'grid' | 'user') {
  if (tab === 'user') {
    imprintStore.restoreMockList()
  }
}
</script>

<template>
  <MobilePage with-tab-bar>
    <main class="home">
      <ImprintSearchHeader v-model:keyword="searchKeyword" />
      <EmptyImprintState v-if="isEmpty" />
      <WaterfallGrid v-else class="home__grid" :items="filteredItems" @select="onSelect" />
    </main>
    <FloatingTabBar active="grid" @change="onTabChange" />
  </MobilePage>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px var(--tm-spacing-page-x) 0;
}

.home__grid {
  flex: 1;
}
</style>
