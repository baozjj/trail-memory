<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  STATUS_FILTER_OPTIONS,
  userStatusLabel,
  userStatusTheme,
  verifyLabel,
  verifyTheme,
  VERIFY_FILTER_OPTIONS,
} from './const'
import { useUsersPage } from './hooks'
import type { UserListItem } from './types'

const router = useRouter()

const {
  canWrite,
  loading,
  items,
  total,
  page,
  pageSize,
  filters,
  loadList,
  search,
  resetFilters,
  drawerVisible,
  drawerLoading,
  detail,
  memoryItems,
  memoryTotal,
  memoryPage,
  memoryPageSize,
  openDetail,
  confirmBan,
  confirmUnban,
  confirmVerify,
  onMemoryPageChange,
} = useUsersPage()

const columns = [
  { colKey: 'email', title: '邮箱', width: 220, ellipsis: true },
  { colKey: 'nickname', title: '昵称', width: 140 },
  { colKey: 'isVerified', title: '验证', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'memoryCount', title: '印记数', width: 90 },
  { colKey: 'createdAt', title: '注册时间', width: 180 },
  { colKey: 'actions', title: '操作', width: 240, fixed: 'right' as const },
]

const memoryColumns = [
  { colKey: 'title', title: '标题', ellipsis: true },
  { colKey: 'isPublic', title: '公开', width: 80 },
  { colKey: 'createdAt', title: '创建时间', width: 180 },
]

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}

function onPageChange(p: { current: number; pageSize: number }) {
  page.value = p.current
  pageSize.value = p.pageSize
  void loadList()
}

function goAllMemories(userEmail: string) {
  void router.push({ name: 'memories', query: { userEmail } })
}
</script>

<template>
  <div class="users-page">
    <div class="users-page__toolbar">
      <h2 class="users-page__title">用户管理</h2>
    </div>

    <div class="users-page__filters">
      <t-input
        v-model="filters.q"
        placeholder="搜索邮箱或昵称"
        clearable
        style="width: 220px"
        @enter="search"
      />
      <t-select
        v-model="filters.verifyFilter"
        :options="VERIFY_FILTER_OPTIONS"
        placeholder="验证状态"
        style="width: 140px"
      />
      <t-select
        v-model="filters.statusFilter"
        :options="STATUS_FILTER_OPTIONS"
        placeholder="账号状态"
        style="width: 140px"
      />
      <t-date-range-picker
        v-model="filters.dateRange"
        allow-input
        clearable
        style="width: 280px"
      />
      <t-space>
        <t-button theme="primary" @click="search">查询</t-button>
        <t-button variant="outline" @click="resetFilters">重置</t-button>
      </t-space>
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
      <template #isVerified="{ row }">
        <t-tag :theme="verifyTheme((row as UserListItem).isVerified)" variant="light">
          {{ verifyLabel((row as UserListItem).isVerified) }}
        </t-tag>
      </template>
      <template #status="{ row }">
        <t-tag :theme="userStatusTheme((row as UserListItem).status)" variant="light">
          {{ userStatusLabel((row as UserListItem).status) }}
        </t-tag>
      </template>
      <template #createdAt="{ row }">
        {{ formatTime((row as UserListItem).createdAt) }}
      </template>
      <template #actions="{ row }">
        <t-space size="small">
          <t-button theme="primary" variant="text" size="small" @click="openDetail(row as UserListItem)">
            详情
          </t-button>
          <template v-if="canWrite">
            <t-button
              v-if="(row as UserListItem).status === 'ACTIVE'"
              theme="default"
              variant="text"
              size="small"
              @click="confirmBan(row as UserListItem)"
            >
              禁用
            </t-button>
            <t-button
              v-else
              theme="primary"
              variant="text"
              size="small"
              @click="confirmUnban(row as UserListItem)"
            >
              启用
            </t-button>
            <t-button
              v-if="!(row as UserListItem).isVerified"
              theme="default"
              variant="text"
              size="small"
              @click="confirmVerify(row as UserListItem)"
            >
              标记已验证
            </t-button>
          </template>
        </t-space>
      </template>
    </t-table>

    <div class="users-page__pagination">
      <t-pagination
        v-model:current="page"
        v-model:page-size="pageSize"
        :total="total"
        show-jumper
        @change="onPageChange"
      />
    </div>

    <t-drawer v-model:visible="drawerVisible" header="用户详情" size="640px" :footer="false">
      <t-loading :loading="drawerLoading" size="small">
        <template v-if="detail">
          <t-descriptions bordered :column="1">
            <t-descriptions-item label="邮箱">{{ detail.email }}</t-descriptions-item>
            <t-descriptions-item label="昵称">{{ detail.nickname }}</t-descriptions-item>
            <t-descriptions-item label="签名">{{ detail.signature || '—' }}</t-descriptions-item>
            <t-descriptions-item label="验证状态">
              <t-tag :theme="verifyTheme(detail.isVerified)" variant="light">
                {{ verifyLabel(detail.isVerified) }}
              </t-tag>
            </t-descriptions-item>
            <t-descriptions-item label="账号状态">
              <t-tag :theme="userStatusTheme(detail.status)" variant="light">
                {{ userStatusLabel(detail.status) }}
              </t-tag>
            </t-descriptions-item>
            <t-descriptions-item label="游客页展示名片">
              {{ detail.showCardOnGuestPage ? '是' : '否' }}
            </t-descriptions-item>
            <t-descriptions-item label="注册时间">
              {{ formatTime(detail.createdAt) }}
            </t-descriptions-item>
            <t-descriptions-item label="更新时间">
              {{ formatTime(detail.updatedAt) }}
            </t-descriptions-item>
          </t-descriptions>

          <div class="users-page__stats">
            <t-card title="印记总数" class="users-page__stat-card">
              <p class="users-page__stat-value">{{ detail.stats.memoryCount }}</p>
            </t-card>
            <t-card title="公开印记" class="users-page__stat-card">
              <p class="users-page__stat-value">{{ detail.stats.publicMemoryCount }}</p>
            </t-card>
          </div>

          <div v-if="canWrite" class="users-page__drawer-actions">
            <t-space>
              <t-button
                v-if="detail.status === 'ACTIVE'"
                theme="warning"
                variant="outline"
                size="small"
                @click="confirmBan(detail)"
              >
                禁用
              </t-button>
              <t-button
                v-else
                theme="primary"
                variant="outline"
                size="small"
                @click="confirmUnban(detail)"
              >
                启用
              </t-button>
              <t-button
                v-if="!detail.isVerified"
                theme="default"
                variant="outline"
                size="small"
                @click="confirmVerify(detail)"
              >
                标记已验证
              </t-button>
            </t-space>
          </div>

          <div class="users-page__memories">
            <div class="users-page__memories-header">
              <h3 class="users-page__memories-title">印记简表</h3>
              <t-button
                theme="primary"
                variant="text"
                size="small"
                @click="goAllMemories(detail.email)"
              >
                查看全部
              </t-button>
            </div>
            <t-table
              row-key="id"
              :data="memoryItems"
              :columns="memoryColumns"
              size="small"
              bordered
            >
              <template #isPublic="{ row }">
                {{ row.isPublic ? '是' : '否' }}
              </template>
              <template #createdAt="{ row }">
                {{ formatTime(row.createdAt) }}
              </template>
            </t-table>
            <div v-if="memoryTotal > memoryPageSize" class="users-page__memories-pagination">
              <t-pagination
                v-model:current="memoryPage"
                v-model:page-size="memoryPageSize"
                :total="memoryTotal"
                size="small"
                @change="onMemoryPageChange"
              />
            </div>
          </div>
        </template>
      </t-loading>
    </t-drawer>
  </div>
</template>

<style scoped>
.users-page__toolbar {
  margin-bottom: 16px;
}

.users-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.users-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.users-page__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.users-page__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;
}

.users-page__stat-card :deep(.t-card__body) {
  padding-top: 8px;
}

.users-page__stat-value {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--tm-color-text-primary);
}

.users-page__drawer-actions {
  margin-bottom: 20px;
}

.users-page__memories-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.users-page__memories-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.users-page__memories-pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
