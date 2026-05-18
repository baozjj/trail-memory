<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import { AddIcon } from 'tdesign-icons-vue-next'
import {
  ADD_BTN_WIDTH_TRANSITION_MS,
  IMAGE_CELL_SIZE,
  IMAGE_ROW_GAP,
  MAX_IMAGE_COUNT,
} from './const'
import { computeImageRowLayout } from './utils'
import type { PublishImageRowEmits, PublishImageRowProps } from './types'

const images = defineModel<string[]>('images', { required: true })
const props = defineProps<PublishImageRowProps>()
const emit = defineEmits<PublishImageRowEmits>()

const rowRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const { width: containerWidth } = useElementSize(rowRef)

const maxCount = computed(() => props.maxCount ?? MAX_IMAGE_COUNT)
const showAddBtn = computed(() => images.value.length < maxCount.value)

const layout = computed(() =>
  computeImageRowLayout(containerWidth.value, images.value.length, showAddBtn.value),
)

const rowGapPx = `${IMAGE_ROW_GAP}px`

const trackScrollable = computed(() => layout.value.needsScroll || layout.value.pinAddBtn)

const dragScrollTarget = computed<HTMLElement | boolean>(() =>
  trackScrollable.value ? (trackRef.value ?? true) : true,
)
</script>

<template>
  <div ref="rowRef" class="image-row" :class="{ 'image-row--pin-add': layout.pinAddBtn }">
    <div
      ref="trackRef"
      class="image-row__track"
      :class="{ 'image-row__track--scrollable': trackScrollable }"
    >
      <VueDraggable
        v-model="images"
        tag="div"
        class="image-row__draggable"
        :animation="150"
        direction="horizontal"
        :scroll="dragScrollTarget"
        :bubble-scroll="true"
        :scroll-sensitivity="48"
        :scroll-speed="14"
      >
        <button
          v-for="(url, index) in images"
          :key="`${url}-${index}`"
          type="button"
          class="image-cell"
          :style="{
            width: `${IMAGE_CELL_SIZE}px`,
            height: `${IMAGE_CELL_SIZE}px`,
          }"
        >
          <img :src="url" alt="" draggable="false" />
        </button>
      </VueDraggable>
      <button
        v-if="showAddBtn && !layout.pinAddBtn"
        type="button"
        class="add-btn"
        :class="{ 'add-btn--compact': layout.isCompactAdd }"
        :style="{
          width: `${layout.addBtnWidth}px`,
          height: `${IMAGE_CELL_SIZE}px`,
          transitionDuration: `${ADD_BTN_WIDTH_TRANSITION_MS}ms`,
        }"
        aria-label="添加图片"
        @click="emit('add')"
      >
        <AddIcon />
      </button>
    </div>
    <button
      v-if="showAddBtn && layout.pinAddBtn"
      type="button"
      class="add-btn add-btn--pinned"
      :class="{ 'add-btn--compact': layout.isCompactAdd }"
      :style="{
        width: `${layout.addBtnWidth}px`,
        height: `${IMAGE_CELL_SIZE}px`,
        transitionDuration: `${ADD_BTN_WIDTH_TRANSITION_MS}ms`,
      }"
      aria-label="添加图片"
      @click="emit('add')"
    >
      <AddIcon />
    </button>
  </div>
</template>

<style scoped>
.image-row {
  display: flex;
  align-items: center;
  height: 96px;
}

.image-row--pin-add {
  gap: v-bind(rowGapPx);
}

.image-row__track {
  display: flex;
  align-items: center;
  gap: v-bind(rowGapPx);
  min-width: 0;
}

.image-row__draggable {
  display: flex;
  align-items: center;
  gap: v-bind(rowGapPx);
  flex-shrink: 0;
  width: max-content;
}

.image-row:not(.image-row--pin-add) .image-row__track {
  flex: 0 1 auto;
  max-width: 100%;
}

.image-row:not(.image-row--pin-add) .image-row__track--scrollable {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.image-row:not(.image-row--pin-add) .image-row__track--scrollable::-webkit-scrollbar {
  display: none;
}

.image-row--pin-add .image-row__track {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.image-row--pin-add .image-row__track::-webkit-scrollbar {
  display: none;
}

.add-btn--pinned {
  flex-shrink: 0;
}

.image-cell {
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: var(--tm-radius-card);
  overflow: hidden;
  background: var(--tm-color-bg-muted);
}

.image-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.add-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--tm-radius-card);
  background: var(--tm-color-bg-muted);
  color: var(--tm-color-icon-inactive);
  cursor: pointer;
  transition-property: width;
  transition-timing-function: ease;
}

.add-btn :deep(svg) {
  width: 28px;
  height: 28px;
}

.add-btn--compact :deep(svg) {
  width: 22px;
  height: 22px;
}
</style>
