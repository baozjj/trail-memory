<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ADMIN_MENU_ITEMS } from './const'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const name = route.name
  return typeof name === 'string' ? name : 'dashboard'
})

function onMenuChange(value: string) {
  const item = ADMIN_MENU_ITEMS.find((m) => m.value === value)
  if (item?.disabled || !item?.to) return
  void router.push(item.to)
}
</script>

<template>
  <t-layout class="admin-layout">
    <t-aside width="232px" class="admin-layout__aside">
      <div class="admin-layout__brand">Trail Memory</div>
      <t-menu
        :value="activeMenu"
        theme="light"
        @change="onMenuChange"
      >
        <t-menu-item
          v-for="item in ADMIN_MENU_ITEMS"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout>
      <t-header height="64px" class="admin-layout__header">
        <span class="admin-layout__title">印记 · 管理后台</span>
        <span class="admin-layout__hint">登录与权限 · 待 M01</span>
      </t-header>
      <t-content class="admin-layout__content">
        <RouterView />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.admin-layout__aside {
  border-right: 1px solid var(--tm-color-border-subtle);
  background: var(--tm-color-bg-page);
}

.admin-layout__brand {
  padding: 20px 16px 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-tight);
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--tm-color-border-subtle);
  background: var(--tm-color-bg-page);
}

.admin-layout__title {
  font-size: 16px;
  font-weight: 600;
}

.admin-layout__hint {
  font-size: 13px;
  color: var(--tm-color-text-tertiary);
}

.admin-layout__content {
  padding: 24px;
  background: var(--tm-color-bg-shell);
}
</style>
