<script setup lang="ts">
import { computed } from 'vue'
import ImprintCard from './components/imprint-card/index.vue'
import type { WaterfallGridEmits, WaterfallGridProps } from './types'
import { splitWaterfallColumns } from './utils'

const props = defineProps<WaterfallGridProps>()
const emit = defineEmits<WaterfallGridEmits>()

const columns = computed(() => splitWaterfallColumns(props.items))
</script>

<template>
  <div class="waterfall" aria-label="印记瀑布流">
    <div class="waterfall__col">
      <ImprintCard
        v-for="item in columns.left"
        :key="item.id"
        :item="item"
        @select="emit('select', $event)"
        @more="emit('more', $event)"
      />
    </div>
    <div class="waterfall__col">
      <ImprintCard
        v-for="item in columns.right"
        :key="item.id"
        :item="item"
        @select="emit('select', $event)"
        @more="emit('more', $event)"
      />
    </div>
  </div>
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
