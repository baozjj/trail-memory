<script setup lang="ts">
import { computed } from 'vue'
import ImprintCover from '@/components/imprint/imprint-cover/index.vue'
import type { ImprintCardEmits, ImprintCardProps } from './types'
import { PRIVATE_BADGE_LABEL } from './const'
import { buildImprintCardMeta } from './utils'

const props = defineProps<ImprintCardProps>()
const emit = defineEmits<ImprintCardEmits>()

const cardMeta = computed(() => buildImprintCardMeta(props.item))

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
    <div class="imprint-card__cover">
      <ImprintCover :type-id="props.item.typeId" :alt="props.item.title" />
      <span v-if="cardMeta.showPrivateBadge" class="imprint-card__badge">
        {{ PRIVATE_BADGE_LABEL }}
      </span>
    </div>
    <div class="imprint-card__footer">
      <div class="imprint-card__info">
        <h3 class="imprint-card__title">{{ props.item.title }}</h3>
        <p v-if="cardMeta.dateText" class="imprint-card__date">{{ cardMeta.dateText }}</p>
        <p v-if="props.item.typeId" class="imprint-card__type">{{ cardMeta.typeText }}</p>
      </div>
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
  -webkit-tap-highlight-color: transparent;
}

.imprint-card:active .imprint-card__cover {
  opacity: 0.92;
}

.imprint-card__cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--tm-radius-card);
  overflow: hidden;
  background: var(--tm-color-bg-page);
  transition: opacity var(--tm-duration-fast) ease;
}

.imprint-card__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.imprint-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.imprint-card__title {
  margin: 0;
  min-width: 0;
  font-size: var(--tm-font-size-subhead);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-normal);
  line-height: 1.3;
  color: var(--tm-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imprint-card__date,
.imprint-card__type {
  margin: 0;
  min-width: 0;
  font-size: var(--tm-font-size-footnote);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imprint-card__date {
  color: var(--tm-color-text-tertiary);
}

.imprint-card__type {
  color: var(--tm-color-text-secondary);
}

.imprint-card__badge {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--tm-color-cta-on-primary);
  background: color-mix(in srgb, var(--tm-color-text-primary) 62%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  pointer-events: none;
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
  border-radius: 50%;
  background: transparent;
  font-size: var(--tm-font-size-subhead);
  letter-spacing: 1px;
  color: var(--tm-color-icon-muted);
  cursor: pointer;
}

.imprint-card__more:active {
  background: var(--tm-color-bg-surface);
}
</style>
