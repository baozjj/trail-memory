<script setup lang="ts">
import { ADMIN_ROLE_OPTIONS, statusLabel, statusTheme } from './const'
import { useAdminsPage } from './hooks'
import type { AdminListItem, AdminRole } from '@/types/admin'

const {
  loading,
  items,
  total,
  page,
  pageSize,
  loadList,
  createVisible,
  createSubmitting,
  createForm,
  openCreate,
  submitCreate,
  resetVisible,
  resetSubmitting,
  resetPassword,
  openResetPassword,
  submitResetPassword,
  confirmDisable,
  confirmEnable,
  changeRole,
  currentAdminId,
} = useAdminsPage()

const columns = [
  { colKey: 'email', title: '邮箱', width: 220 },
  { colKey: 'displayName', title: '显示名', width: 140 },
  { colKey: 'role', title: '角色', width: 160 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'lastLoginAt', title: '最近登录', width: 180 },
  { colKey: 'createdAt', title: '创建时间', width: 180 },
  { colKey: 'actions', title: '操作', width: 220, fixed: 'right' as const },
]

function formatTime(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('zh-CN')
}

function onPageChange(p: { current: number; pageSize: number }) {
  page.value = p.current
  pageSize.value = p.pageSize
  void loadList()
}
</script>

<template>
  <div class="admins-page">
    <div class="admins-page__toolbar">
      <h2 class="admins-page__title">管理员账号</h2>
      <t-button theme="primary" @click="openCreate">新建管理员</t-button>
    </div>

    <t-table
      row-key="id"
      :data="items"
      :columns="columns"
      :loading="loading"
      bordered
      stripe
      hover
    >
      <template #role="{ row }">
        <t-select
          :value="(row as AdminListItem).role"
          :options="ADMIN_ROLE_OPTIONS"
          size="small"
          style="width: 140px"
          @change="(v: AdminRole) => changeRole(row as AdminListItem, v)"
        />
      </template>
      <template #status="{ row }">
        <t-tag :theme="statusTheme((row as AdminListItem).status)" variant="light">
          {{ statusLabel((row as AdminListItem).status) }}
        </t-tag>
      </template>
      <template #lastLoginAt="{ row }">
        {{ formatTime((row as AdminListItem).lastLoginAt) }}
      </template>
      <template #createdAt="{ row }">
        {{ formatTime((row as AdminListItem).createdAt) }}
      </template>
      <template #actions="{ row }">
        <t-space size="small">
          <t-button
            v-if="(row as AdminListItem).status === 'ACTIVE'"
            theme="default"
            variant="text"
            size="small"
            :disabled="(row as AdminListItem).id === currentAdminId()"
            @click="confirmDisable(row as AdminListItem)"
          >
            禁用
          </t-button>
          <t-button
            v-else
            theme="primary"
            variant="text"
            size="small"
            @click="confirmEnable(row as AdminListItem)"
          >
            启用
          </t-button>
          <t-button
            theme="default"
            variant="text"
            size="small"
            @click="openResetPassword(row as AdminListItem)"
          >
            重置密码
          </t-button>
        </t-space>
      </template>
    </t-table>

    <div class="admins-page__pagination">
      <t-pagination
        v-model:current="page"
        v-model:page-size="pageSize"
        :total="total"
        show-jumper
        @change="onPageChange"
      />
    </div>

    <t-dialog
      v-model:visible="createVisible"
      header="新建管理员"
      :confirm-btn="{ content: '创建', loading: createSubmitting }"
      @confirm="submitCreate"
    >
      <t-form label-width="88px">
        <t-form-item label="邮箱">
          <t-input v-model="createForm.email" placeholder="admin@example.com" />
        </t-form-item>
        <t-form-item label="密码">
          <t-input v-model="createForm.password" type="password" placeholder="至少 8 位" />
        </t-form-item>
        <t-form-item label="显示名">
          <t-input v-model="createForm.displayName" placeholder="显示名称" />
        </t-form-item>
        <t-form-item label="角色">
          <t-select v-model="createForm.role" :options="ADMIN_ROLE_OPTIONS" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="resetVisible"
      header="重置密码"
      :confirm-btn="{ content: '确认重置', loading: resetSubmitting }"
      @confirm="submitResetPassword"
    >
      <t-form label-width="72px">
        <t-form-item label="新密码">
          <t-input v-model="resetPassword" type="password" placeholder="至少 8 位" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<style scoped>
.admins-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.admins-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.admins-page__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
