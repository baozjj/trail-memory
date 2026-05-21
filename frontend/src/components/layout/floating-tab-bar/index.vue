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
      :aria-current="active === 'grid' ? 'page' : undefined"
      @click="emit('change', 'grid')"
    >
      <AppIcon class="tab-icon" :class="{ 'tab-icon--inactive': active !== 'grid' }" />
      <span v-if="active === 'grid'" class="tab-dot" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="tab-item"
      :class="{ 'tab-item--active': active === 'user' }"
      aria-label="我的"
      :aria-current="active === 'user' ? 'page' : undefined"
      @click="emit('change', 'user')"
    >
      <UserIcon class="tab-icon" :class="{ 'tab-icon--inactive': active !== 'user' }" />
      <span v-if="active === 'user'" class="tab-dot" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.floating-tab-bar {
  position: fixed;
  left: 50%;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 172px;
  height: 54px;
  padding: 0 38px;
  border-radius: var(--tm-radius-pill);
  background: var(--tm-color-bg-overlay);
  backdrop-filter: var(--tm-blur-frosted);
  -webkit-backdrop-filter: var(--tm-blur-frosted);
  border: 1px solid var(--tm-color-border-subtle);
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
  -webkit-tap-highlight-color: transparent;
}

.tab-item:active {
  opacity: 0.72;
}

.tab-icon {
  width: 22px;
  height: 22px;
  color: var(--tm-color-text-primary);
  transition: color var(--tm-duration-fast) ease;
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
