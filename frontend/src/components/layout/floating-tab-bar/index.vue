<script setup lang="ts">
import { AppIcon, UserIcon } from 'tdesign-icons-vue-next'
import type { FloatingTabBarEmits, FloatingTabBarProps } from './types'

defineProps<FloatingTabBarProps>()
const emit = defineEmits<FloatingTabBarEmits>()
</script>

<template>
  <div class="floating-tab-bar" aria-label="主导航">
    <button
      type="button"
      class="tab-item"
      :class="{ 'tab-item--active': active === 'grid' }"
      aria-label="印记列表"
      @click="emit('change', 'grid')"
    >
      <AppIcon class="tab-icon" />
      <span v-if="active === 'grid'" class="tab-dot" />
    </button>
    <button
      type="button"
      class="tab-item"
      :class="{ 'tab-item--active': active === 'user' }"
      aria-label="我的"
      @click="emit('change', 'user')"
    >
      <UserIcon class="tab-icon tab-icon--inactive" />
    </button>
  </div>
</template>

<style scoped>
.floating-tab-bar {
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 168px;
  height: 52px;
  padding: 0 36px;
  border-radius: var(--tm-radius-pill);
  background: var(--tm-color-bg-page);
  box-shadow: var(--tm-shadow-tab);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.tab-icon {
  width: 22px;
  height: 22px;
  color: var(--tm-color-text-primary);
}

.tab-icon--inactive {
  color: var(--tm-color-icon-inactive);
}

.tab-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tm-color-text-primary);
}
</style>
