<script setup lang="ts">
import { REFERENCED_FILTER_OPTIONS, formatBytes, formatTotalMb } from './const'
import { useMediaPage } from './hooks'
import type { MediaListItem } from './types'

const {
  loading,
  statsLoading,
  stats,
  items,
  total,
  page,
  pageSize,
  filters,
  loadList,
  search,
  resetFilters,
  refresh,
  drawerVisible,
  drawerLoading,
  references,
  imageViewerVisible,
  openDetail,
  openImageViewer,
  goToMemories,
} = useMediaPage()

const columns = [
  { colKey: 'thumb', title: '预览', width: 88 },
  { colKey: 'filename', title: '文件名', width: 220, ellipsis: true },
  { colKey: 'sizeBytes', title: '大小', width: 100 },
  { colKey: 'mimeType', title: '类型', width: 110 },
  { colKey: 'mtime', title: '修改时间', width: 180 },
  { colKey: 'referenced', title: '引用', width: 100 },
  { colKey: 'referenceCount', title: '引用数', width: 80 },
  { colKey: 'actions', title: '操作', width: 100, fixed: 'right' as const },
]

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}

function onPageChange(p: { current: number; pageSize: number }) {
  page.value = p.current
  pageSize.value = p.pageSize
  void loadList()
}

function isImageMime(mimeType: string | null): boolean {
  return Boolean(mimeType?.startsWith('image/'))
}
</script>

<template>
  <div class="media-page">
    <div class="media-page__toolbar">
      <h2 class="media-page__title">图片管理</h2>
      <t-button variant="outline" :loading="statsLoading || loading" @click="refresh">
        刷新
      </t-button>
    </div>

    <div class="media-page__stats">
      <t-card :loading="statsLoading" bordered>
        <div class="media-page__stat-value">{{ stats?.fileCount ?? '—' }}</div>
        <div class="media-page__stat-label">文件数</div>
      </t-card>
      <t-card :loading="statsLoading" bordered>
        <div class="media-page__stat-value">
          {{ stats ? `${formatTotalMb(stats.totalBytes)} MB` : '—' }}
        </div>
        <div class="media-page__stat-label">总占用</div>
      </t-card>
      <t-card bordered>
        <div class="media-page__stat-hint">
          扫描目录 <code>backend/uploads/</code>，展示用户上传的印记图片与头像；点击行可查看所属印记。
        </div>
      </t-card>
    </div>

    <div class="media-page__filters">
      <t-input
        v-model="filters.q"
        placeholder="搜索文件名"
        clearable
        style="width: 220px"
        @enter="search"
      />
      <t-select
        v-model="filters.referencedFilter"
        :options="[...REFERENCED_FILTER_OPTIONS]"
        placeholder="引用状态"
        style="width: 140px"
      />
      <t-space>
        <t-button theme="primary" @click="search">查询</t-button>
        <t-button variant="outline" @click="resetFilters">重置</t-button>
      </t-space>
    </div>

    <t-table
      row-key="filename"
      :data="items"
      :columns="columns"
      :loading="loading"
      bordered
      stripe
      hover
      @row-click="(ctx: { row: unknown }) => openDetail(ctx.row as MediaListItem)"
    >
      <template #thumb="{ row }">
        <t-image
          v-if="isImageMime((row as MediaListItem).mimeType)"
          :src="(row as MediaListItem).url"
          fit="cover"
          class="media-page__thumb"
        />
        <span v-else class="media-page__no-preview">—</span>
      </template>
      <template #sizeBytes="{ row }">
        {{ formatBytes((row as MediaListItem).sizeBytes) }}
      </template>
      <template #mimeType="{ row }">
        {{ (row as MediaListItem).mimeType || '—' }}
      </template>
      <template #mtime="{ row }">
        {{ formatTime((row as MediaListItem).mtime) }}
      </template>
      <template #referenced="{ row }">
        <t-tag
          :theme="(row as MediaListItem).referenced ? 'success' : 'default'"
          variant="light"
        >
          {{ (row as MediaListItem).referenced ? '已引用' : '未引用' }}
        </t-tag>
      </template>
      <template #actions="{ row }">
        <t-button
          theme="primary"
          variant="text"
          size="small"
          @click.stop="openDetail(row as MediaListItem)"
        >
          引用详情
        </t-button>
      </template>
    </t-table>

    <div class="media-page__pagination">
      <t-pagination
        v-model:current="page"
        v-model:page-size="pageSize"
        :total="total"
        show-jumper
        @change="onPageChange"
      />
    </div>

    <t-drawer v-model:visible="drawerVisible" header="图片详情" size="640px" :footer="false">
      <t-loading :loading="drawerLoading" size="small">
        <template v-if="references">
          <div v-if="isImageMime(references.mimeType)" class="media-page__drawer-preview">
            <t-image
              :src="references.url"
              fit="contain"
              class="media-page__drawer-image"
              @click="openImageViewer"
            />
            <t-button size="small" variant="outline" @click="openImageViewer">全屏查看</t-button>
          </div>

          <t-descriptions bordered :column="1" class="media-page__descriptions">
            <t-descriptions-item label="文件名">{{ references.filename }}</t-descriptions-item>
            <t-descriptions-item label="访问路径">
              <code>{{ references.url }}</code>
            </t-descriptions-item>
            <t-descriptions-item label="大小">
              {{ formatBytes(references.sizeBytes) }}（{{ references.sizeBytes }} 字节）
            </t-descriptions-item>
            <t-descriptions-item label="MIME">
              {{ references.mimeType || '未知' }}
            </t-descriptions-item>
            <t-descriptions-item label="修改时间">
              {{ formatTime(references.mtime) }}
            </t-descriptions-item>
          </t-descriptions>

          <h3 class="media-page__section-title">
            所属印记（{{ references.memories.length }}）
          </h3>
          <t-empty v-if="!references.memories.length" description="无印记引用" />
          <t-list v-else split>
            <t-list-item v-for="memory in references.memories" :key="memory.id">
              <div class="media-page__ref-row">
                <div>
                  <div class="media-page__ref-title">{{ memory.title }}</div>
                  <div class="media-page__ref-meta">
                    {{ memory.ownerNickname }} · {{ memory.ownerEmail }}
                    <t-tag
                      v-if="memory.deletedAt"
                      theme="danger"
                      variant="light"
                      size="small"
                      class="media-page__ref-tag"
                    >
                      已删除
                    </t-tag>
                  </div>
                </div>
                <t-button
                  size="small"
                  variant="outline"
                  @click="goToMemories(memory.ownerEmail)"
                >
                  查看该用户印记
                </t-button>
              </div>
            </t-list-item>
          </t-list>

          <h3 class="media-page__section-title">
            用户头像（{{ references.users.length }}）
          </h3>
          <t-empty v-if="!references.users.length" description="无头像引用" />
          <t-list v-else split>
            <t-list-item v-for="user in references.users" :key="user.id">
              <div class="media-page__ref-row">
                <div>
                  <div class="media-page__ref-title">{{ user.nickname }}</div>
                  <div class="media-page__ref-meta">{{ user.email }}</div>
                </div>
              </div>
            </t-list-item>
          </t-list>
        </template>
      </t-loading>
    </t-drawer>

    <t-image-viewer
      v-if="references"
      v-model:visible="imageViewerVisible"
      :images="[references.url]"
    />
  </div>
</template>

<style scoped>
.media-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.media-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.media-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.media-page__stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.media-page__stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: var(--tm-color-text-tertiary);
}

.media-page__stat-hint {
  font-size: 13px;
  line-height: 1.6;
  color: var(--tm-color-text-secondary);
}

.media-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.media-page__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.media-page__thumb {
  width: 56px;
  height: 56px;
  border-radius: 6px;
}

.media-page__no-preview {
  color: var(--tm-color-text-tertiary);
}

.media-page__drawer-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.media-page__drawer-image {
  max-width: 100%;
  max-height: 240px;
  border-radius: 8px;
  cursor: pointer;
}

.media-page__descriptions {
  margin-bottom: 8px;
}

.media-page__section-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
}

.media-page__ref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.media-page__ref-title {
  font-weight: 500;
}

.media-page__ref-meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--tm-color-text-tertiary);
}

.media-page__ref-tag {
  margin-left: 8px;
}
</style>
