<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import {
  ADD_BTN_WIDTH_TRANSITION_MS,
  DELETE_ZONE_HEIGHT,
  IMAGE_CELL_SIZE,
  IMAGE_ROW_GAP,
  SORTABLE_REORDER_ANIMATION_MS,
} from './const'
import { useDragDeleteZone } from './hooks/use-drag-delete-zone'
import { useImageCellPress } from './hooks/use-image-cell-press'
import {
  cleanupSortableDragArtifacts,
  computeImageRowLayout,
  scrollTrackToRevealLastImage,
} from './utils'
import type { PublishImageRowEmits } from './types'

const images = defineModel<string[]>('images', { required: true })
const emit = defineEmits<PublishImageRowEmits>()

const rowRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const { width: containerWidth } = useElementSize(rowRef)

const layout = computed(() =>
  computeImageRowLayout(containerWidth.value, images.value.length, true),
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

async function revealLastImageAfterAdd() {
  await nextTick()
  requestAnimationFrame(() => {
    const track = trackRef.value
    if (!track) return
    scrollTrackToRevealLastImage(track)
  })
}

watch(
  () => images.value.length,
  (len, prevLen = 0) => {
    if (len <= prevLen) return
    void revealLastImageAfterAdd()
  },
)

const { pressingIndex, onPressStart, onPressEnd } = useImageCellPress()

const {
  dragging,
  overDeleteZone,
  deleteZoneRef,
  onDragStart: showDeleteZone,
  onDragEnd: finishDeleteZone,
} = useDragDeleteZone()

function lockDocumentSelection() {
  document.body.classList.add('tm-image-row--no-select')
}

function unlockDocumentSelection() {
  document.body.classList.remove('tm-image-row--no-select')
}

function onDragStart(event: SortableEvent) {
  onPressEnd()
  lockDocumentSelection()
  void showDeleteZone()
  const index = event.oldIndex
  dragItemUrl.value = index !== undefined && index >= 0 ? (images.value[index] ?? null) : null
}

function getDragEndEvent(event: SortableEvent): Event | undefined {
  return (event as SortableEvent & { originalEvent?: Event }).originalEvent
}

function onDragEnd(event: SortableEvent) {
  onPressEnd()
  const shouldDelete = finishDeleteZone(getDragEndEvent(event))
  const url = dragItemUrl.value
  dragItemUrl.value = null

  nextTick(() => {
    cleanupSortableDragArtifacts()
    unlockDocumentSelection()

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
  <div
    ref="rowRef"
    class="image-row"
    :class="{ 'image-row--pin-add': layout.pinAddBtn }"
    @selectstart.prevent
    @dragstart.prevent
  >
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
        :animation="SORTABLE_REORDER_ANIMATION_MS"
        direction="horizontal"
        :scroll="dragScrollTarget"
        :bubble-scroll="false"
        :scroll-sensitivity="48"
        :scroll-speed="20"
        :force-fallback="true"
        :fallback-on-body="true"
        :fallback-tolerance="0"
        :delay="80"
        :delay-on-touch-only="true"
        chosen-class="image-cell--chosen"
        ghost-class="image-cell--ghost"
        drag-class="image-cell--drag"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <button
          v-for="(url, index) in images"
          :key="`${url}-${index}`"
          type="button"
          class="image-cell"
          :class="{ 'image-cell--press': pressingIndex === index }"
          :style="{
            width: `${IMAGE_CELL_SIZE}px`,
            height: `${IMAGE_CELL_SIZE}px`,
          }"
          @pointerdown="onPressStart(index, $event)"
          @pointerup="onPressEnd"
          @pointercancel="onPressEnd"
        >
          <img :src="url" alt="" draggable="false" />
        </button>
      </VueDraggable>
      <button
        v-if="!layout.pinAddBtn"
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
      v-if="layout.pinAddBtn"
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
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.image-row :deep(*) {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.image-row :deep(*)::selection {
  background: transparent;
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
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
  transition:
    box-shadow 0.14s ease,
    opacity 0.14s ease;
}

/* 按下瞬间：提示可继续拖动 */
@media (hover: hover) {
  .image-cell:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.image-cell--press:not(.image-cell--chosen):not(.image-cell--drag) {
  opacity: 0.92;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 选中待拖：不用 scale，避免跟手偏移 */
.image-cell--chosen {
  box-shadow:
    0 0 0 2px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.14);
  z-index: 1;
  cursor: grabbing;
  transition: none;
}

.image-cell--ghost {
  opacity: 0.35;
  transition: none;
}

.image-cell--drag {
  opacity: 1;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  cursor: grabbing;
  transition: none !important;
}

.image-cell img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
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

<style>
body.tm-image-row--no-select,
body.tm-image-row--no-select * {
  user-select: none !important;
  -webkit-user-select: none !important;
}

.sortable-fallback,
.sortable-drag,
.sortable-ghost,
.sortable-chosen {
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-user-drag: none !important;
  transition: none !important;
  animation: none !important;
  will-change: transform;
}

.sortable-fallback img,
.sortable-drag img {
  pointer-events: none;
  user-select: none !important;
  -webkit-user-drag: none !important;
}

.sortable-fallback.image-cell--chosen,
.sortable-fallback.image-cell--drag,
.sortable-drag.image-cell--drag {
  border-radius: 8px;
  cursor: grabbing;
}
</style>
