<script setup lang="ts">
import { computed, ref } from 'vue'
import { Swiper as TSwiper, SwiperItem as TSwiperItem } from 'tdesign-mobile-vue'
import type { ArticleHeroProps } from './types'

const props = defineProps<ArticleHeroProps>()

const current = ref(0)
const indicator = computed(() => `${current.value + 1}/${props.images.length}`)
</script>

<template>
  <div class="article-hero">
    <TSwiper v-model:current="current" class="article-hero__swiper" :autoplay="false">
      <TSwiperItem v-for="(src, i) in images" :key="`${src}-${i}`">
        <img class="article-hero__img" :src="src" alt="" />
      </TSwiperItem>
    </TSwiper>
    <span v-if="images.length > 1" class="article-hero__indicator">{{ indicator }}</span>
  </div>
</template>

<style scoped>
.article-hero {
  position: relative;
  height: 506px;
  background: #000;
}

.article-hero__swiper {
  height: 100%;
}

.article-hero__img {
  width: 100%;
  height: 506px;
  object-fit: cover;
}

.article-hero__indicator {
  position: absolute;
  right: 20px;
  top: 18px;
  z-index: 2;
  padding: 4px 12px;
  border-radius: 13px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.44);
}
</style>
