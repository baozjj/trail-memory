<script setup lang="ts">
import { computed } from 'vue'
import type { ImprintListItem } from '@/types/imprint'
import ImprintCard from './ImprintCard.vue'

const props = defineProps<{
  items: ImprintListItem[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const columns = computed(() => {
  const left: ImprintListItem[] = []
  const right: ImprintListItem[] = []
  props.items.forEach((item, index) => {
    if (index % 2 === 0) left.push(item)
    else right.push(item)
  })
  return { left, right }
})
</script>

<template>
  <section class="waterfall" aria-label="印记瀑布流">
    <div class="waterfall__col">
      <ImprintCard
        v-for="item in columns.left"
        :key="item.id"
        :item="item"
        @click="emit('select', $event)"
      />
    </div>
    <div class="waterfall__col">
      <ImprintCard
        v-for="item in columns.right"
        :key="item.id"
        :item="item"
        @click="emit('select', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.waterfall {
  display: flex;
  gap: var(--tm-spacing-grid-gap);
}

.waterfall__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--tm-spacing-card-gap);
  min-width: 0;
}
</style>
