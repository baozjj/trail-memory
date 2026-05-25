<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ADMIN_MENU_ITEMS } from './const'
import { roleLabel, roleTheme } from '@/views/admins/const'
import { useAdminAuthStore } from '@/stores/admin-auth'

const route = useRoute()
const router = useRouter()
const authStore = useAdminAuthStore()

const activeMenu = computed(() => {
  const name = route.name
  return typeof name === 'string' ? name : 'dashboard'
})

const menuItems = computed(() => {
  const isSuperAdmin = authStore.admin?.role === 'SUPER_ADMIN'
  return ADMIN_MENU_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  )
})

function onMenuChange(value: string) {
  const item = menuItems.value.find((m) => m.value === value)
  if (item?.disabled || !item?.to) return
  void router.push(item.to)
}

function logout() {
  authStore.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <t-layout class="admin-layout">
    <t-aside width="232px" class="admin-layout__aside">
      <div class="admin-layout__brand">Trail Memory</div>
      <t-menu :value="activeMenu" theme="light" @change="onMenuChange">
        <t-menu-item
          v-for="item in menuItems"
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
        <div v-if="authStore.admin" class="admin-layout__user">
          <span class="admin-layout__name">{{ authStore.admin.displayName }}</span>
          <t-tag :theme="roleTheme(authStore.admin.role)" variant="light" size="small">
            {{ roleLabel(authStore.admin.role) }}
          </t-tag>
          <t-button theme="default" variant="text" size="small" @click="logout">退出</t-button>
        </div>
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

.admin-layout__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-layout__name {
  font-size: 14px;
  color: var(--tm-color-text-secondary);
}

.admin-layout__content {
  padding: 24px;
  background: var(--tm-color-bg-shell);
}
</style>
