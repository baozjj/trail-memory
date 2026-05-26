<script setup lang="ts">
import {
  CONTENT_PREVIEW_LENGTH,
  deletedLabel,
  deletedTheme,
  PUBLIC_FILTER_OPTIONS,
  publicLabel,
  publicTheme,
} from './const'
import { useMemoriesPage } from './hooks'
import type { MemoryDetail, MemoryListItem } from './types'

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
  contentExpanded,
  imageViewerVisible,
  imageViewerIndex,
  openDetail,
  confirmUnpublish,
  confirmDelete,
  copyShareSlug,
  openImageViewer,
  typeOptions,
} = useMemoriesPage()

const columns = [
  { colKey: 'title', title: '标题', width: 200, ellipsis: true },
  { colKey: 'owner', title: '用户', width: 180, ellipsis: true },
  { colKey: 'typeLabel', title: '类型', width: 120 },
  { colKey: 'isPublic', title: '公开', width: 80 },
  { colKey: 'linkSuffix', title: '分享后缀', width: 120 },
  { colKey: 'createdAt', title: '封存时间', width: 180 },
  { colKey: 'deletedAt', title: '状态', width: 90 },
  { colKey: 'actions', title: '操作', width: 220, fixed: 'right' as const },
]

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}

function onPageChange(p: { current: number; pageSize: number }) {
  page.value = p.current
  pageSize.value = p.pageSize
  void loadList()
}

function displayContent(content: string) {
  if (contentExpanded.value || content.length <= CONTENT_PREVIEW_LENGTH) {
    return content
  }
  return `${content.slice(0, CONTENT_PREVIEW_LENGTH)}…`
}

function sharePath(slug: string) {
  return `/m/${slug}`
}

function formatBytes(value: number | null) {
  if (value === null || value < 0) return '大小未知'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}

function getDetailImages(detail: MemoryDetail) {
  if (detail.imageInfos?.length) return detail.imageInfos
  return detail.images.map((url) => ({ url, filename: '未命名', sizeBytes: null }))
}
</script>

<template>
  <div class="memories-page">
    <div class="memories-page__toolbar">
      <h2 class="memories-page__title">印记管理</h2>
    </div>

    <div class="memories-page__filters">
      <t-input
        v-model="filters.q"
        placeholder="搜索标题或 meta"
        clearable
        style="width: 200px"
        @enter="search"
      />
      <t-input
        v-model="filters.userEmail"
        placeholder="用户邮箱"
        clearable
        style="width: 200px"
      />
      <t-select
        v-model="filters.publicFilter"
        :options="PUBLIC_FILTER_OPTIONS"
        placeholder="公开状态"
        style="width: 120px"
      />
      <t-select
        v-model="filters.typeId"
        :options="typeOptions"
        placeholder="印记类型"
        style="width: 140px"
      />
      <t-date-range-picker
        v-model="filters.dateRange"
        allow-input
        clearable
        style="width: 280px"
      />
      <t-switch v-model="filters.hasDeleted" label="含已删除" />
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
      <template #owner="{ row }">
        <div class="memories-page__owner">
          <span>{{ (row as MemoryListItem).ownerNickname }}</span>
          <span class="memories-page__owner-email">{{ (row as MemoryListItem).ownerEmail }}</span>
        </div>
      </template>
      <template #typeLabel="{ row }">
        {{ (row as MemoryListItem).typeLabel || '—' }}
      </template>
      <template #isPublic="{ row }">
        <t-tag :theme="publicTheme((row as MemoryListItem).isPublic)" variant="light">
          {{ publicLabel((row as MemoryListItem).isPublic) }}
        </t-tag>
      </template>
      <template #createdAt="{ row }">
        {{ formatTime((row as MemoryListItem).createdAt) }}
      </template>
      <template #deletedAt="{ row }">
        <t-tag :theme="deletedTheme((row as MemoryListItem).deletedAt)" variant="light">
          {{ deletedLabel((row as MemoryListItem).deletedAt) }}
        </t-tag>
      </template>
      <template #actions="{ row }">
        <t-space size="small">
          <t-button
            theme="primary"
            variant="text"
            size="small"
            @click="openDetail(row as MemoryListItem)"
          >
            详情
          </t-button>
          <template v-if="canWrite && !(row as MemoryListItem).deletedAt">
            <t-button
              v-if="(row as MemoryListItem).isPublic"
              theme="default"
              variant="text"
              size="small"
              @click="confirmUnpublish(row as MemoryListItem)"
            >
              强制下架
            </t-button>
            <t-button
              theme="danger"
              variant="text"
              size="small"
              @click="confirmDelete(row as MemoryListItem)"
            >
              删除
            </t-button>
          </template>
        </t-space>
      </template>
    </t-table>

    <div class="memories-page__pagination">
      <t-pagination
        v-model:current="page"
        v-model:page-size="pageSize"
        :total="total"
        show-jumper
        @change="onPageChange"
      />
    </div>

    <t-drawer v-model:visible="drawerVisible" header="印记详情" size="720px" :footer="false">
      <t-loading :loading="drawerLoading" size="small">
        <template v-if="detail">
          <t-descriptions bordered :column="2">
            <t-descriptions-item label="标题" :span="2">{{ detail.title }}</t-descriptions-item>
            <t-descriptions-item label="用户">{{ detail.user.nickname }}</t-descriptions-item>
            <t-descriptions-item label="邮箱">{{ detail.user.email }}</t-descriptions-item>
            <t-descriptions-item label="类型">{{ detail.typeLabel || '—' }}</t-descriptions-item>
            <t-descriptions-item label="公开">
              <t-tag :theme="publicTheme(detail.isPublic)" variant="light">
                {{ publicLabel(detail.isPublic) }}
              </t-tag>
            </t-descriptions-item>
            <t-descriptions-item label="Meta" :span="2">{{ detail.meta || '—' }}</t-descriptions-item>
            <t-descriptions-item label="分享 slug" :span="2">
              <t-space>
                <code>{{ detail.shareSlug }}</code>
                <t-button size="small" variant="outline" @click="copyShareSlug(detail.shareSlug)">
                  复制 slug
                </t-button>
                <t-button
                  size="small"
                  variant="outline"
                  @click="copyShareSlug(sharePath(detail.shareSlug))"
                >
                  复制路径
                </t-button>
              </t-space>
            </t-descriptions-item>
            <t-descriptions-item label="封存时间">{{ formatTime(detail.createdAt) }}</t-descriptions-item>
            <t-descriptions-item label="状态">
              <t-tag :theme="deletedTheme(detail.deletedAt)" variant="light">
                {{ deletedLabel(detail.deletedAt) }}
              </t-tag>
            </t-descriptions-item>
          </t-descriptions>

          <div v-if="detail.images.length" class="memories-page__images">
            <h3 class="memories-page__section-title">图片</h3>
            <div class="memories-page__image-grid">
              <div
                v-for="(image, index) in getDetailImages(detail)"
                :key="image.url"
                class="memories-page__image-item"
              >
                <t-image
                  :src="image.url"
                  fit="cover"
                  class="memories-page__thumb"
                  @click="openImageViewer(index)"
                />
                <div class="memories-page__image-meta">
                  <span class="memories-page__image-name" :title="image.filename">
                    {{ image.filename }}
                  </span>
                  <span>{{ formatBytes(image.sizeBytes) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="detail.content" class="memories-page__content">
            <h3 class="memories-page__section-title">正文</h3>
            <p class="memories-page__content-text">{{ displayContent(detail.content) }}</p>
            <t-button
              v-if="detail.content.length > CONTENT_PREVIEW_LENGTH"
              theme="default"
              variant="text"
              size="small"
              @click="contentExpanded = !contentExpanded"
            >
              {{ contentExpanded ? '收起' : '展开全文' }}
            </t-button>
          </div>

          <div v-if="canWrite && !detail.deletedAt" class="memories-page__drawer-actions">
            <t-space>
              <t-button
                v-if="detail.isPublic"
                theme="warning"
                variant="outline"
                @click="confirmUnpublish(detail)"
              >
                强制下架
              </t-button>
              <t-button theme="danger" variant="outline" @click="confirmDelete(detail)">
                删除
              </t-button>
            </t-space>
          </div>
        </template>
      </t-loading>
    </t-drawer>

    <t-image-viewer
      v-if="detail"
      v-model:visible="imageViewerVisible"
      :images="detail.images"
      :default-index="imageViewerIndex"
    />
  </div>
</template>

<style scoped>
.memories-page__toolbar {
  margin-bottom: 16px;
}

.memories-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.memories-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.memories-page__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.memories-page__owner {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.memories-page__owner-email {
  font-size: 12px;
  color: var(--tm-color-text-tertiary);
}

.memories-page__section-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
}

.memories-page__images {
  margin-top: 8px;
}

.memories-page__image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.memories-page__image-item {
  width: 120px;
}

.memories-page__thumb {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  cursor: pointer;
}

.memories-page__image-meta {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--tm-color-text-tertiary);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.memories-page__image-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memories-page__content-text {
  margin: 0;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--tm-color-text-secondary);
}

.memories-page__drawer-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--tm-color-border-subtle);
}
</style>
