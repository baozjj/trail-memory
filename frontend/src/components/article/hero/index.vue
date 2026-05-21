<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ImagePreview from '@/components/common/image-preview/index.vue'
import type { ArticleHeroProps } from './types'

const props = defineProps<ArticleHeroProps>()

const trackRef = ref<HTMLDivElement | null>(null)
const current = ref(0)
const previewVisible = ref(false)
const previewIndex = ref(0)
const isTeleporting = ref(false)

const hasMultiple = computed(() => props.images.length > 1)
const singleSrc = computed(() => props.images[0] ?? '')
const indicator = computed(() => `${current.value + 1}/${props.images.length}`)

/** 多图时首尾各加一张克隆，用于循环滑动 */
const loopSlides = computed(() => {
  const imgs = props.images
  if (imgs.length <= 1) return imgs
  return [imgs[imgs.length - 1]!, ...imgs, imgs[0]!]
})

function clampLogical(index: number) {
  const max = Math.max(props.images.length - 1, 0)
  return Math.min(Math.max(index, 0), max)
}

function slideLogicalIndex(slideIndex: number) {
  const n = props.images.length
  if (n <= 1) return slideIndex
  if (slideIndex === 0) return n - 1
  if (slideIndex === n + 1) return 0
  return slideIndex - 1
}

function scrollToRawIndex(rawIndex: number, behavior: ScrollBehavior = 'auto') {
  const track = trackRef.value
  if (!track) return
  const width = track.clientWidth
  if (!width) return
  track.scrollTo({ left: width * rawIndex, behavior })
}

function scrollToLogical(logical: number, behavior: ScrollBehavior = 'auto') {
  const n = props.images.length
  if (n <= 1) {
    scrollToRawIndex(clampLogical(logical), behavior)
    return
  }
  scrollToRawIndex(clampLogical(logical) + 1, behavior)
}

function teleportToRaw(rawIndex: number) {
  isTeleporting.value = true
  scrollToRawIndex(rawIndex, 'auto')
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isTeleporting.value = false
    })
  })
}

function syncIndexFromScroll() {
  if (isTeleporting.value) return

  const track = trackRef.value
  if (!track || !track.clientWidth) return

  const rawIndex = Math.round(track.scrollLeft / track.clientWidth)
  const n = props.images.length

  if (n <= 1) {
    current.value = clampLogical(rawIndex)
    return
  }

  if (rawIndex === 0) {
    current.value = n - 1
    teleportToRaw(n)
    return
  }

  if (rawIndex === n + 1) {
    current.value = 0
    teleportToRaw(1)
    return
  }

  current.value = clampLogical(rawIndex - 1)
}

async function resetCarousel() {
  current.value = 0
  await nextTick()
  scrollToLogical(0)
}

watch(
  () => props.images,
  async () => {
    await resetCarousel()
  },
  { deep: true },
)

onMounted(() => {
  if (hasMultiple.value) void resetCarousel()
})

function openPreview(slideIndex: number) {
  previewIndex.value = slideLogicalIndex(slideIndex)
  previewVisible.value = true
}
</script>

<template>
  <div class="article-hero" :class="{ 'article-hero--multiple': hasMultiple }">
    <button
      v-if="!hasMultiple && singleSrc"
      type="button"
      class="article-hero__tap article-hero__tap--single"
      aria-label="查看图片"
      @click="openPreview(0)"
    >
      <div class="article-hero__frame">
        <img class="article-hero__bg" :src="singleSrc" alt="" aria-hidden="true" />
        <img class="article-hero__img" :src="singleSrc" alt="" decoding="async" />
      </div>
    </button>

    <div
      v-else-if="hasMultiple"
      ref="trackRef"
      class="article-hero__track"
      @scroll.passive="syncIndexFromScroll"
    >
      <div
        v-for="(src, i) in loopSlides"
        :key="`hero-slide-${i}`"
        class="article-hero__slide"
      >
        <button
          type="button"
          class="article-hero__tap"
          :aria-label="`查看第 ${slideLogicalIndex(i) + 1} 张图片`"
          @click="openPreview(i)"
        >
          <div class="article-hero__frame">
            <img
              class="article-hero__bg"
              :src="src"
              alt=""
              aria-hidden="true"
              decoding="async"
            />
            <img
              class="article-hero__img"
              :src="src"
              :alt="`图片 ${slideLogicalIndex(i) + 1}`"
              decoding="async"
            />
          </div>
        </button>
      </div>
    </div>

    <span v-if="hasMultiple" class="article-hero__indicator">{{ indicator }}</span>
    <ImagePreview
      v-model:visible="previewVisible"
      :images="images"
      :initial-index="previewIndex"
    />
  </div>
</template>

<style scoped>
.article-hero {
  position: relative;
  height: 506px;
  background: var(--tm-color-bg-inverse);
  overflow: hidden;
}

.article-hero--multiple {
  overscroll-behavior: none;
}

.article-hero__track {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  touch-action: pan-x pinch-zoom;
}

.article-hero__slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.article-hero__tap {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.article-hero__tap--single {
  touch-action: pan-y;
}

.article-hero__frame {
  position: relative;
  width: 100%;
  height: 506px;
  overflow: hidden;
  background: var(--tm-color-bg-inverse);
}

/* 留白区：同图放大模糊铺底，避免纯黑边 */
.article-hero__bg {
  position: absolute;
  inset: -16%;
  width: 132%;
  height: 132%;
  object-fit: cover;
  object-position: center;
  filter: blur(28px) brightness(0.62) saturate(1.08);
  transform: scale(1.06);
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.article-hero__img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.article-hero__indicator {
  position: absolute;
  right: var(--tm-spacing-page-x);
  top: calc(16px + env(safe-area-inset-top, 0px));
  z-index: 2;
  padding: 5px 12px;
  border-radius: var(--tm-radius-chip);
  font-size: var(--tm-font-size-caption);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--tm-color-text-on-inverse);
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(12px);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .article-hero__bg {
    filter: brightness(0.5) saturate(1.05);
    transform: none;
  }
}
</style>
