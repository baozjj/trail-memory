<script setup lang="ts">
import { computed } from 'vue'
import { resolveAvatarUrl } from '@/utils/avatar'
import type { AuthorCardProps } from './types'

const props = defineProps<AuthorCardProps>()

const avatarSrc = computed(() => resolveAvatarUrl(props.author.avatarUrl))
</script>

<template>
  <div class="author-card">
    <img class="author-card__avatar" :src="avatarSrc" :alt="author.name" />
    <div class="author-card__info">
      <p class="author-card__name">{{ author.name }}</p>
      <p v-if="author.bio" class="author-card__bio">{{ author.bio }}</p>
    </div>
  </div>
</template>

<style scoped>
.author-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--tm-radius-lg);
  background: var(--tm-color-bg-elevated);
}

.author-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--tm-color-bg-surface);
}

.author-card__info {
  min-width: 0;
}

.author-card__name {
  margin: 0 0 4px;
  font-size: var(--tm-font-size-subhead);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-normal);
  color: var(--tm-color-text-primary);
}

.author-card__bio {
  margin: 0;
  font-size: var(--tm-font-size-footnote);
  line-height: 1.45;
  color: var(--tm-color-text-tertiary);
}
</style>
