<script setup lang="ts">
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import ImprintSearchHeader from '@/components/imprint/search-header/index.vue'
import WaterfallGrid from '@/components/imprint/waterfall-grid/index.vue'
import EmptyImprintState from '@/components/empty/imprint-state/index.vue'
import CardActionSheet from '@/components/imprint/card-action-sheet/index.vue'
import ExhibitSettingsSheet from '@/components/imprint/exhibit-settings-sheet/index.vue'
import { useHomePage } from './hooks'

const {
  filteredItems,
  isEmpty,
  searchKeyword,
  actionSheetVisible,
  exhibitSheetVisible,
  activeItem,
  onSelect,
  onCardMore,
  onCardAction,
  onExhibitSave,
  onTabChange,
} = useHomePage()
</script>

<template>
  <MobilePage with-tab-bar>
    <div class="home">
      <header v-if="!isEmpty" class="home__header">
        <ImprintSearchHeader v-model:keyword="searchKeyword" />
      </header>

      <EmptyImprintState v-if="isEmpty" />
      <WaterfallGrid
        v-else
        class="home__grid"
        :items="filteredItems"
        @select="onSelect"
        @more="onCardMore"
      />
    </div>

    <FloatingTabBar active="grid" @change="onTabChange" />

    <CardActionSheet v-model:visible="actionSheetVisible" @action="onCardAction" />
    <ExhibitSettingsSheet
      v-model:visible="exhibitSheetVisible"
      :item="activeItem"
      @save="onExhibitSave"
    />
  </MobilePage>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px var(--tm-spacing-page-x) 0;
}

.home__header {
  position: sticky;
  top: 0;
  z-index: 20;
  margin: 0 calc(-1 * var(--tm-spacing-page-x));
  padding: 4px var(--tm-spacing-page-x) 12px;
  background: var(--tm-color-bg-page);
}

.home__grid {
  flex: 1;
}
</style>
