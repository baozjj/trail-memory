<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Navbar as TNavbar } from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import ArticleHero from '@/components/article/hero/index.vue'
import AuthorCard from '@/components/article/author-card/index.vue'
import { getArticleById } from '@/mock'

const route = useRoute()
const router = useRouter()

const article = computed(() => getArticleById(String(route.params.id)))

function goBack() {
  router.back()
}
</script>

<template>
  <MobilePage v-if="article">
    <ArticleHero :images="article.images" />
    <TNavbar class="article-nav" left-arrow :title="''" @left-click="goBack" />
    <div class="article">
      <div class="article__body">
        <h1 class="article__title">{{ article.title }}</h1>
        <p class="article__content">{{ article.content }}</p>
        <p class="article__meta">{{ article.meta }}</p>
      </div>
      <AuthorCard :author="article.author" />
    </div>
  </MobilePage>
  <MobilePage v-else>
    <TNavbar title="印记详情" left-arrow @left-click="goBack" />
    <p class="article-missing">未找到该印记（Mock）</p>
  </MobilePage>
</template>

<style scoped>
.article-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: transparent !important;
}

.article-nav :deep(.t-navbar__content) {
  background: transparent;
}

.article {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: calc(100dvh - 506px);
  padding: 24px 24px 20px;
  margin-top: -8px;
  border-radius: 0;
  background: var(--tm-color-bg-page);
}

.article__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.article__title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
}

.article__content {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--tm-color-text-secondary);
}

.article__meta {
  margin: 0;
  font-size: 12px;
  color: var(--tm-color-text-meta);
}

.article-missing {
  padding: 48px 24px;
  text-align: center;
  color: var(--tm-color-text-tertiary);
}
</style>
