<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { CloseIcon } from 'tdesign-icons-vue-next'
import type { ImagePreviewEmits, ImagePreviewProps } from './types'

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  initialIndex: 0,
})
const emit = defineEmits<ImagePreviewEmits>()

const trackRef = ref<HTMLDivElement | null>(null)
const current = ref(0)

const indicator = computed(() => {
  if (props.images.length <= 1) return ''
  return `${current.value + 1} / ${props.images.length}`
})

function clampIndex(index: number) {
  const max = Math.max(props.images.length - 1, 0)
  return Math.min(Math.max(index, 0), max)
}

function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
  const track = trackRef.value
  if (!track) return
  const width = track.clientWidth
  if (!width) return
  track.scrollTo({ left: width * clampIndex(index), behavior })
}

function syncIndexFromScroll() {
  const track = trackRef.value
  if (!track || !track.clientWidth) return
  current.value = clampIndex(Math.round(track.scrollLeft / track.clientWidth))
}

function setBodyScrollLock(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(
  () => props.visible,
  async (open) => {
    if (!open) {
      setBodyScrollLock(false)
      return
    }
    current.value = clampIndex(props.initialIndex)
    setBodyScrollLock(true)
    await nextTick()
    scrollToIndex(current.value)
  },
)

watch(
  () => props.initialIndex,
  (index) => {
    if (!props.visible) return
    current.value = clampIndex(index)
    void nextTick(() => scrollToIndex(current.value))
  },
)

onUnmounted(() => {
  setBodyScrollLock(false)
})

function close() {
  emit('update:visible', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="image-preview-fade">
      <div
        v-if="visible && images.length"
        class="image-preview"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        tabindex="-1"
        @keydown="onKeydown"
        @click.self="close"
      >
        <button
          type="button"
          class="image-preview__close"
          aria-label="关闭预览"
          @click.stop="close"
        >
          <CloseIcon />
        </button>
        <span v-if="indicator" class="image-preview__indicator">{{ indicator }}</span>
        <div ref="trackRef" class="image-preview__track" @scroll.passive="syncIndexFromScroll">
          <div
            v-for="(src, i) in images"
            :key="`preview-${src}-${i}`"
            class="image-preview__slide"
          >
            <img
              class="image-preview__img"
              :src="src"
              :alt="`图片 ${i + 1}`"
              @click.stop
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-preview {
  position: fixed;
  inset: 0;
  z-index: 12000;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.96);
}

.image-preview__close {
  position: absolute;
  top: calc(12px + env(safe-area-inset-top, 0px));
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.image-preview__close :deep(svg) {
  width: 22px;
  height: 22px;
}

.image-preview__indicator {
  position: absolute;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  z-index: 3;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

.image-preview__track {
  flex: 1;
  display: flex;
  width: 100%;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.image-preview__slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.image-preview__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.image-preview-fade-enter-active,
.image-preview-fade-leave-active {
  transition: opacity 0.2s ease;
}

.image-preview-fade-enter-from,
.image-preview-fade-leave-to {
  opacity: 0;
}
</style>
