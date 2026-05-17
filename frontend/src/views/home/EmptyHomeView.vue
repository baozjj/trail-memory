<script setup lang="ts">
import MobilePage from '@/components/layout/MobilePage.vue'
import FloatingTabBar from '@/components/layout/FloatingTabBar.vue'
import EmptyImprintState from '@/components/empty/EmptyImprintState.vue'
</script>

<template>
  <MobilePage with-tab-bar>
    <main class="empty-home">
      <EmptyImprintState />
    </main>
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
