<script setup lang="ts">
import type { ImprintListItem } from '@/types/imprint'

const props = defineProps<{
  item: ImprintListItem
}>()

const emit = defineEmits<{
  click: [id: string]
}>()
</script>

<template>
  <article class="imprint-card" @click="emit('click', props.item.id)">
    <div
      class="imprint-card__cover"
      :style="{ paddingBottom: `${props.item.heightWeight * 100}%` }"
    >
      <img :src="props.item.coverUrl" :alt="props.item.title" loading="lazy" />
    </div>
    <div class="imprint-card__footer">
      <h3 class="imprint-card__title">{{ props.item.title }}</h3>
      <span class="imprint-card__more" aria-hidden="true">···</span>
    </div>
  </article>
</template>

<style scoped>
.imprint-card {
  cursor: pointer;
}

.imprint-card__cover {
  position: relative;
  width: 100%;
  border-radius: var(--tm-radius-card);
  overflow: hidden;
  background: var(--tm-color-bg-muted);
}

.imprint-card__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imprint-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.imprint-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--tm-color-text-primary);
}

.imprint-card__more {
  flex-shrink: 0;
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--tm-color-icon-muted);
}
</style>
