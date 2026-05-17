<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as TButton } from 'tdesign-mobile-vue'
import { MOCK_IMAGES } from '@/mock'

const router = useRouter()

function goPublish() {
  router.push({ name: 'publish' })
}
</script>

<template>
  <section class="empty-state">
    <img
      class="empty-state__hex"
      :src="MOCK_IMAGES.hexWireframe"
      alt=""
      aria-hidden="true"
    />
    <p class="empty-state__text">行囊空空，去走一段路，把山野装进这里</p>
    <TButton class="empty-state__cta" theme="primary" shape="round" size="large" @click="goPublish">
      + 封存新印记
    </TButton>
  </section>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 0 40px 100px;
  min-height: 60vh;
}

.empty-state__hex {
  width: 168px;
  height: 168px;
  object-fit: contain;
  opacity: 0.85;
}

.empty-state__text {
  margin: 0;
  max-width: 280px;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: var(--tm-color-text-meta);
}

.empty-state__cta {
  width: 200px;
  --td-button-primary-bg-color: var(--tm-color-cta-primary);
  --td-button-primary-active-bg-color: #222;
  --td-button-primary-color: var(--tm-color-cta-on-primary);
}
</style>
