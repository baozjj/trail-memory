<script setup lang="ts">
import { computed, ref } from 'vue'
import { Swiper as TSwiper, SwiperItem as TSwiperItem } from 'tdesign-mobile-vue'
import ImagePreview from '@/components/common/image-preview/index.vue'
import type { ArticleHeroProps } from './types'

const props = defineProps<ArticleHeroProps>()

const current = ref(0)
const previewVisible = ref(false)
const previewIndex = ref(0)

const hasMultiple = computed(() => props.images.length > 1)
const singleSrc = computed(() => props.images[0] ?? '')
const indicator = computed(() => `${current.value + 1}/${props.images.length}`)

function openPreview(index: number) {
  previewIndex.value = index
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
      <img class="article-hero__img" :src="singleSrc" alt="" />
    </button>

    <TSwiper
      v-else-if="hasMultiple"
      v-model:current="current"
      class="article-hero__swiper"
      :autoplay="false"
      :loop="false"
    >
      <TSwiperItem v-for="(src, i) in images" :key="`${src}-${i}`">
        <button
          type="button"
          class="article-hero__tap"
          :aria-label="`查看第 ${i + 1} 张图片`"
          @click="openPreview(i)"
        >
          <img class="article-hero__img" :src="src" alt="" />
        </button>
      </TSwiperItem>
    </TSwiper>

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

.article-hero__swiper {
  height: 100%;
  touch-action: pan-x pinch-zoom;
  overscroll-behavior: contain;
}

.article-hero__swiper :deep(.t-swiper) {
  touch-action: pan-x;
}

.article-hero__tap {
  display: block;
  width: 100%;
  height: 506px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.article-hero__tap--single {
  touch-action: pan-y;
}

.article-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
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
}
</style>
