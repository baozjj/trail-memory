<script setup lang="ts">
import { computed } from 'vue'
import { AppIcon, UserIcon } from 'tdesign-icons-vue-next'
import { TAB_ICON_ACTIVE, TAB_ICON_INACTIVE } from './const'
import type { FloatingTabBarEmits, FloatingTabBarProps } from './types'

const props = withDefaults(defineProps<FloatingTabBarProps>(), {
  activeTab: 'grid',
})
const emit = defineEmits<FloatingTabBarEmits>()

const gridStrokeColor = computed(() =>
  props.activeTab === 'grid' ? TAB_ICON_ACTIVE : TAB_ICON_INACTIVE,
)
const userStrokeColor = computed(() =>
  props.activeTab === 'user' ? TAB_ICON_ACTIVE : TAB_ICON_INACTIVE,
)
</script>

<template>
  <div class="floating-tab-bar" aria-label="主导航">
    <button
      type="button"
      class="tab-item"
      :class="{ 'tab-item--active': activeTab === 'grid' }"
      aria-label="印记列表"
      :aria-current="activeTab === 'grid' ? 'page' : undefined"
      @click="emit('change', 'grid')"
    >
      <AppIcon class="tab-icon" :stroke-color="gridStrokeColor" />
      <span v-if="activeTab === 'grid'" class="tab-dot" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="tab-item"
      :class="{ 'tab-item--active': activeTab === 'user' }"
      aria-label="我的"
      :aria-current="activeTab === 'user' ? 'page' : undefined"
      @click="emit('change', 'user')"
    >
      <UserIcon class="tab-icon" :stroke-color="userStrokeColor" />
      <span v-if="activeTab === 'user'" class="tab-dot" aria-hidden="true" />
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
  flex-shrink: 0;
}

.tab-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tm-color-text-primary);
}
</style>
