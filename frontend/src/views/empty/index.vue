<script setup lang="ts">
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import EmptyImprintState from '@/components/empty/imprint-state/index.vue'
</script>

<template>
  <MobilePage with-tab-bar>
    <div class="empty-home">
      <EmptyImprintState />
    </div>
    <FloatingTabBar active="grid" />
  </MobilePage>
</template>

<style scoped>
.empty-home {
  min-height: calc(100dvh - 120px);
  display: flex;
  align-items: center;
}
</style>
