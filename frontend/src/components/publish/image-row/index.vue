<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import {
  ADD_BTN_WIDTH_TRANSITION_MS,
  DELETE_ZONE_HEIGHT,
  IMAGE_CELL_SIZE,
  IMAGE_ROW_GAP,
  MAX_IMAGE_COUNT,
} from './const'
import { useDragDeleteZone } from './hooks/use-drag-delete-zone'
import { cleanupSortableDragArtifacts, computeImageRowLayout } from './utils'
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

/** 仅横向图片 track 可滚；禁止冒泡到页面，避免拖到底部时整页下滚 */
const dragScrollTarget = computed<HTMLElement | boolean>(() =>
  trackScrollable.value ? (trackRef.value ?? false) : false,
)

const dragItemUrl = ref<string | null>(null)
const sortableKey = ref(0)

function onAddClick() {
  emit('add')
}

const {
  dragging,
  overDeleteZone,
  deleteZoneRef,
  onDragStart: showDeleteZone,
  onDragEnd: finishDeleteZone,
} = useDragDeleteZone()

async function onDragStart(event: SortableEvent) {
  await showDeleteZone()
  const index = event.oldIndex
  dragItemUrl.value =
    index !== undefined && index >= 0 ? (images.value[index] ?? null) : null
}

function getDragEndEvent(event: SortableEvent): Event | undefined {
  return (event as SortableEvent & { originalEvent?: Event }).originalEvent
}

function onDragEnd(event: SortableEvent) {
  const shouldDelete = finishDeleteZone(getDragEndEvent(event))
  const url = dragItemUrl.value
  dragItemUrl.value = null

  nextTick(() => {
    cleanupSortableDragArtifacts()

    if (shouldDelete && url) {
      const index = images.value.indexOf(url)
      if (index !== -1) {
        images.value.splice(index, 1)
      }
      sortableKey.value += 1
    }
  })
}
</script>

<template>
  <div ref="rowRef" class="image-row" :class="{ 'image-row--pin-add': layout.pinAddBtn }">
    <div
      ref="trackRef"
      class="image-row__track"
      :class="{ 'image-row__track--scrollable': trackScrollable }"
    >
      <VueDraggable
        :key="sortableKey"
        v-model="images"
        tag="div"
        class="image-row__draggable"
        :animation="150"
        direction="horizontal"
        :scroll="dragScrollTarget"
        :bubble-scroll="false"
        :scroll-sensitivity="48"
        :scroll-speed="14"
        :force-fallback="true"
        :fallback-on-body="true"
        :delay="80"
        :delay-on-touch-only="true"
        @start="onDragStart"
        @end="onDragEnd"
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
        @pointerup.stop="onAddClick"
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
      @pointerup.stop="onAddClick"
    >
      <AddIcon />
    </button>
  </div>

  <Teleport to="body">
    <Transition name="delete-zone">
      <div
        v-if="dragging"
        ref="deleteZoneRef"
        class="delete-zone"
        :class="{ 'delete-zone--active': overDeleteZone }"
        :style="{ height: `${DELETE_ZONE_HEIGHT}px` }"
      >
        <DeleteIcon class="delete-zone__icon" />
        <span class="delete-zone__label">
          {{ overDeleteZone ? '松手删除' : '拖到此处删除' }}
        </span>
      </div>
    </Transition>
  </Teleport>
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
  position: relative;
  z-index: 2;
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
  touch-action: manipulation;
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

.delete-zone {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(
    180deg,
    rgba(253, 236, 237, 0.94) 0%,
    rgba(248, 186, 192, 0.9) 40%,
    rgba(232, 108, 118, 0.92) 100%
  );
  color: #b32633;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  user-select: none;
  pointer-events: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.delete-zone--active {
  background: linear-gradient(
    180deg,
    rgba(249, 170, 178, 0.96) 0%,
    rgba(235, 88, 100, 0.96) 35%,
    rgba(185, 38, 48, 1) 100%
  );
  color: #ffffff;
  transform: scaleY(1.04);
  transform-origin: bottom center;
}

.delete-zone__icon {
  width: 22px;
  height: 22px;
  opacity: 0.75;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.delete-zone--active .delete-zone__icon {
  opacity: 1;
  transform: scale(1.12);
}

.delete-zone__label {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    font-size 0.2s ease,
    color 0.2s ease;
}

.delete-zone--active .delete-zone__label {
  font-size: 16px;
}

.delete-zone-enter-active,
.delete-zone-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.delete-zone-enter-from,
.delete-zone-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
