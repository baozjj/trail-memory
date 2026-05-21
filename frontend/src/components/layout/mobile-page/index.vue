<script setup lang="ts">
import type { MobilePageProps } from './types'

defineProps<MobilePageProps>()
</script>

<template>
  <div class="mobile-page" :class="{ 'mobile-page--tab': withTabBar }">
    <slot />
  </div>
</template>

<style scoped>
.mobile-page {
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: var(--tm-color-bg-page);
  color: var(--tm-color-text-primary);
  font-family: var(--tm-font-family);
  position: relative;
  overflow-x: hidden;
}

.mobile-page--tab {
  padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
}
</style>
