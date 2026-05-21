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
  padding: calc(10px + env(safe-area-inset-top, 0px)) var(--tm-spacing-page-x) 0;
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
  border-radius: 50%;
  color: var(--tm-color-text-primary);
  background: var(--tm-color-bg-overlay);
  backdrop-filter: var(--tm-blur-frosted);
  -webkit-backdrop-filter: var(--tm-blur-frosted);
  box-shadow: var(--tm-shadow-floating);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--tm-duration-fast) ease;
}

.article-nav__back:active {
  transform: scale(0.94);
}

.article-nav__back :deep(svg) {
  width: 22px;
  height: 22px;
}
</style>
