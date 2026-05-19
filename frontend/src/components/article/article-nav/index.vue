<script setup lang="ts">
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import type { ArticleNavEmits, ArticleNavProps } from './types'

withDefaults(defineProps<ArticleNavProps>(), {
  showBack: true,
})
const emit = defineEmits<ArticleNavEmits>()

function onBack() {
  emit('back')
}
</script>

<template>
  <nav class="article-nav" aria-label="印记详情导航">
    <button
      v-if="showBack"
      type="button"
      class="article-nav__back"
      aria-label="返回上一页"
      @click="onBack"
    >
      <ChevronLeftIcon />
    </button>
  </nav>
</template>

<style scoped>
.article-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 12;
  display: flex;
  align-items: flex-start;
  padding: calc(8px + env(safe-area-inset-top, 0px)) 12px 0;
  pointer-events: none;
}

.article-nav__back {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 20px;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.article-nav__back:active {
  transform: scale(0.96);
  background: rgba(255, 255, 255, 1);
}

.article-nav__back :deep(svg) {
  width: 22px;
  height: 22px;
}
</style>
