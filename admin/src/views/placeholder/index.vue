<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => (route.meta.title as string) ?? '模块')
const moduleCode = computed(() => (route.meta.placeholder as string) ?? '—')
</script>

<template>
  <t-card :title="title">
    <t-empty description="功能开发中">
      <template #action>
        <p class="placeholder__hint">本模块将在 <strong>{{ moduleCode }}</strong> 实现。</p>
      </template>
    </t-empty>
  </t-card>
</template>

<style scoped>
.placeholder__hint {
  margin: 0;
  color: var(--tm-color-text-secondary);
}
</style>
