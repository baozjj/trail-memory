<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as TButton } from 'tdesign-mobile-vue'
import { MOCK_IMAGES } from '@/mock'
import { CTA_TEXT, EMPTY_HINT_TEXT } from './const'

const router = useRouter()

function goPublish() {
  router.push({ name: 'publish' })
}
</script>

<template>
  <div class="empty-state">
    <img
      class="empty-state__hex"
      :src="MOCK_IMAGES.hexWireframe"
      alt=""
      aria-hidden="true"
    />
    <p class="empty-state__text">{{ EMPTY_HINT_TEXT }}</p>
    <TButton
      class="empty-state__cta tm-btn-primary"
      theme="primary"
      block
      size="large"
      @click="goPublish"
    >
      {{ CTA_TEXT }}
    </TButton>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 var(--tm-spacing-section) 100px;
  min-height: 62vh;
}

.empty-state__hex {
  width: 160px;
  height: 160px;
  object-fit: contain;
  opacity: 0.78;
}

.empty-state__text {
  margin: 0;
  max-width: 280px;
  font-size: var(--tm-font-size-subhead);
  line-height: 1.55;
  letter-spacing: var(--tm-letter-spacing-normal);
  text-align: center;
  color: var(--tm-color-text-tertiary);
}

.empty-state__cta {
  max-width: 240px;
}
</style>
