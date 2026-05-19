<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as TButton } from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import ArticleHero from '@/components/article/hero/index.vue'
import ArticleNav from '@/components/article/article-nav/index.vue'
import AuthorCard from '@/components/article/author-card/index.vue'
import { useArticlePage } from './hooks'
import {
  ARTICLE_LOADING_TEXT,
  ARTICLE_NOT_FOUND_TEXT,
} from './const'

const router = useRouter()
const { article, loading, errorMessage, showBack, showAuthorCard, reload } = useArticlePage()

function goBack() {
  router.back()
}
</script>

<template>
  <MobilePage v-if="loading" class="article-page">
    <ArticleNav :show-back="showBack" @back="goBack" />
    <p class="article-state">{{ ARTICLE_LOADING_TEXT }}</p>
  </MobilePage>

  <MobilePage v-else-if="article" class="article-page">
    <ArticleHero :images="article.images" />
    <ArticleNav :show-back="showBack" @back="goBack" />
    <div class="article">
      <div class="article__body">
        <h1 class="article__title">{{ article.title }}</h1>
        <p v-if="article.content" class="article__content">{{ article.content }}</p>
        <p v-if="article.meta" class="article__meta">{{ article.meta }}</p>
      </div>
      <AuthorCard v-if="showAuthorCard" :author="article.author" />
    </div>
  </MobilePage>

  <MobilePage v-else class="article-page">
    <ArticleNav :show-back="showBack" @back="goBack" />
    <p class="article-state">{{ errorMessage ?? ARTICLE_NOT_FOUND_TEXT }}</p>
    <TButton v-if="errorMessage" block theme="primary" variant="outline" @click="reload">
      重试
    </TButton>
  </MobilePage>
</template>

<style scoped>
.article-page {
  position: relative;
}

.article-state {
  padding: calc(72px + env(safe-area-inset-top, 0px)) 24px 48px;
  text-align: center;
  color: var(--tm-color-text-tertiary);
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
  white-space: pre-wrap;
}

.article__meta {
  margin: 0;
  font-size: 12px;
  color: var(--tm-color-text-meta);
}
</style>
