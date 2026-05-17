<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Navbar as TNavbar } from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import type { TabKey } from '@/components/layout/floating-tab-bar/types'

const router = useRouter()

function onTabChange(tab: TabKey) {
  if (tab === 'grid') {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <MobilePage with-tab-bar>
    <TNavbar title="个人中心" :left-arrow="false" />
    <div class="profile">
      <p class="profile__hint">个人中心（Mock 占位页）</p>
    </div>
    <FloatingTabBar active="user" @change="onTabChange" />
  </MobilePage>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 24px var(--tm-spacing-page-x);
}

.profile__hint {
  margin: 0;
  font-size: 14px;
  color: var(--tm-color-text-meta);
  text-align: center;
}
</style>
