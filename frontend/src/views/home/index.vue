<script setup lang="ts">
import { ref } from 'vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import ImprintSearchHeader from '@/components/imprint/search-header/index.vue'
import WaterfallGrid from '@/components/imprint/waterfall-grid/index.vue'
import EmptyImprintState from '@/components/empty/imprint-state/index.vue'
import CardActionSheet from '@/components/imprint/card-action-sheet/index.vue'
import ExhibitSettingsSheet from '@/components/imprint/exhibit-settings-sheet/index.vue'
import { useHomePage } from './hooks'
import { useHomeScrollHeader } from './hooks/use-scroll-header'

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

const headerRef = ref<HTMLElement | null>(null)
const { headerVisible, spacerHeight } = useHomeScrollHeader(headerRef)
</script>

<template>
  <MobilePage with-tab-bar>
    <div class="home">
      <div
        v-if="!isEmpty"
        class="home__header-spacer"
        :style="{ height: `${spacerHeight}px` }"
        aria-hidden="true"
      />

      <header
        v-if="!isEmpty"
        ref="headerRef"
        class="home__header"
        :class="{ 'home__header--hidden': !headerVisible }"
      >
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
  gap: var(--tm-spacing-card-gap);
  padding: 8px var(--tm-spacing-page-x) 0;
}

.home__header-spacer {
  flex-shrink: 0;
  margin: 0;
}

.home__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: calc(8px + env(safe-area-inset-top, 0px)) var(--tm-spacing-page-x) 12px;
  background: var(--tm-color-bg-overlay);
  backdrop-filter: var(--tm-blur-frosted);
  -webkit-backdrop-filter: var(--tm-blur-frosted);
  border-bottom: 1px solid var(--tm-color-border-subtle);
  transform: translateY(0);
  transition: transform var(--tm-duration-normal) var(--tm-ease-standard);
  will-change: transform;
}

.home__header--hidden {
  transform: translateY(-100%);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .home__header {
    transition: none;
  }
}

.home__grid {
  flex: 1;
}
</style>
