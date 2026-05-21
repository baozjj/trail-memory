<script setup lang="ts">
import ImprintCover from '@/components/imprint/imprint-cover/index.vue'
import type { ImprintCardEmits, ImprintCardProps } from './types'

const props = defineProps<ImprintCardProps>()
const emit = defineEmits<ImprintCardEmits>()

function onSelect() {
  emit('select', props.item.id)
}

function onMore(event: MouseEvent) {
  event.stopPropagation()
  emit('more', props.item.id)
}
</script>

<template>
  <article class="imprint-card" @click="onSelect">
    <div
      class="imprint-card__cover"
      :class="{ 'imprint-card__cover--no-type': !props.item.typeId }"
      :style="
        props.item.typeId
          ? { paddingBottom: `${props.item.heightWeight * 100}%` }
          : undefined
      "
    >
      <ImprintCover :type-id="props.item.typeId" :alt="props.item.title" />
    </div>
    <div class="imprint-card__footer">
      <h3 class="imprint-card__title">{{ props.item.title }}</h3>
      <button
        type="button"
        class="imprint-card__more"
        aria-label="更多操作"
        @click="onMore"
      >
        ···
      </button>
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

.imprint-card__cover--no-type {
  aspect-ratio: 1;
  padding-bottom: 0 !important;
  background: var(--tm-color-bg-page, #ffffff);
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
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--tm-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imprint-card__more {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  margin: -8px -8px -8px 0;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--tm-color-icon-muted);
  cursor: pointer;
}
</style>
