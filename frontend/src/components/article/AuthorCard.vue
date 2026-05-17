<script setup lang="ts">
import type { Author } from '@/types/imprint'

defineProps<{
  author: Author
}>()
</script>

<template>
  <aside class="author-card">
    <img class="author-card__avatar" :src="author.avatarUrl" :alt="author.name" />
    <div class="author-card__info">
      <p class="author-card__name">{{ author.name }}</p>
      <p class="author-card__bio">{{ author.bio }}</p>
    </div>
  </aside>
</template>

<style scoped>
.author-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  background: var(--tm-color-bg-elevated);
}

.author-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  object-fit: cover;
  flex-shrink: 0;
}

.author-card__info {
  min-width: 0;
}

.author-card__name {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
}

.author-card__bio {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--tm-color-text-tertiary);
}
</style>
