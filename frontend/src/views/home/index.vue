<script setup lang="ts">
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import ImprintSearchHeader from '@/components/imprint/search-header/index.vue'
import WaterfallGrid from '@/components/imprint/waterfall-grid/index.vue'
import EmptyImprintState from '@/components/empty/imprint-state/index.vue'
import { useHomePage } from './hooks'

const { filteredItems, isEmpty, searchKeyword, onSelect, onTabChange } = useHomePage()
</script>

<template>
  <MobilePage with-tab-bar>
    <div class="home">
      <ImprintSearchHeader v-model:keyword="searchKeyword" />
      <EmptyImprintState v-if="isEmpty" />
      <WaterfallGrid v-else class="home__grid" :items="filteredItems" @select="onSelect" />
    </div>
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
