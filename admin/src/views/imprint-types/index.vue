<script setup lang="ts">
import { ref } from 'vue'
import { ENABLED_FILTER_OPTIONS } from './const'
import { useImprintTypesPage } from './hooks'
import type { ImprintTypeItem } from './types'

const fileInputRef = ref<HTMLInputElement | null>(null)

const {
  canWrite,
  loading,
  items,
  filters,
  drawerVisible,
  drawerMode,
  submitting,
  form,
  coverProcessing,
  coverConfirming,
  coverPreview,
  coverConfirmed,
  coverInfo,
  coverPreviewSrc,
  canConfirmCover,
  coverNeedsConfirm,
  search,
  resetFilters,
  openCreate,
  openEdit,
  onCoverFileChange,
  processCover,
  confirmCover,
  submitForm,
  confirmToggleEnabled,
} = useImprintTypesPage()

const columns = [
  { colKey: 'coverPath', title: '封面', width: 200 },
  { colKey: 'id', title: 'ID', width: 140 },
  { colKey: 'label', title: '名称', width: 140 },
  { colKey: 'sortOrder', title: '排序', width: 80 },
  { colKey: 'enabled', title: '启用', width: 90 },
  { colKey: 'updatedAt', title: '更新时间', width: 180 },
  { colKey: 'actions', title: '操作', width: 120, fixed: 'right' as const },
]

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}

function pickCoverFile() {
  fileInputRef.value?.click()
}

function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  onCoverFileChange(file)
  input.value = ''
}

function formatBytes(value: number | null) {
  if (value === null || value < 0) return '大小未知'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}
</script>

<template>
  <div class="imprint-types-page">
    <div class="imprint-types-page__toolbar">
      <h2 class="imprint-types-page__title">印记类型</h2>
      <t-button v-if="canWrite" theme="primary" @click="openCreate">新建类型</t-button>
    </div>

    <div class="imprint-types-page__filters">
      <t-input
        v-model="filters.q"
        placeholder="搜索 ID 或名称"
        clearable
        style="width: 220px"
        @enter="search"
      />
      <t-select
        v-model="filters.enabledFilter"
        :options="ENABLED_FILTER_OPTIONS"
        placeholder="启用状态"
        style="width: 140px"
      />
      <t-space>
        <t-button theme="primary" @click="search">查询</t-button>
        <t-button variant="outline" @click="resetFilters">重置</t-button>
      </t-space>
    </div>

    <t-table row-key="id" :data="items" :columns="columns" :loading="loading" bordered stripe hover>
      <template #coverPath="{ row }">
        <div class="imprint-types-page__cover-cell">
          <t-image
            :src="(row as ImprintTypeItem).coverPath"
            fit="cover"
            class="imprint-types-page__cover"
          />
          <div class="imprint-types-page__cover-meta">
            <span class="imprint-types-page__cover-name" :title="(row as ImprintTypeItem).coverInfo.filename">
              {{ (row as ImprintTypeItem).coverInfo.filename }}
            </span>
            <span>{{ formatBytes((row as ImprintTypeItem).coverInfo.sizeBytes) }}</span>
          </div>
        </div>
      </template>
      <template #enabled="{ row }">
        <t-switch
          :value="(row as ImprintTypeItem).enabled"
          :disabled="!canWrite"
          @change="(v: boolean) => confirmToggleEnabled(row as ImprintTypeItem, v)"
        />
      </template>
      <template #updatedAt="{ row }">
        {{ formatTime((row as ImprintTypeItem).updatedAt) }}
      </template>
      <template #actions="{ row }">
        <t-button
          v-if="canWrite"
          theme="primary"
          variant="text"
          size="small"
          @click="openEdit(row as ImprintTypeItem)"
        >
          编辑
        </t-button>
      </template>
    </t-table>

    <t-drawer
      v-model:visible="drawerVisible"
      :header="drawerMode === 'create' ? '新建印记类型' : '编辑印记类型'"
      size="520px"
      :confirm-btn="{
        content: '保存',
        loading: submitting,
        disabled: coverNeedsConfirm,
      }"
      @confirm="submitForm"
    >
      <t-form label-width="96px">
        <t-form-item label="ID">
          <t-input v-model="form.id" placeholder="maolihao" :disabled="drawerMode === 'edit'" />
        </t-form-item>
        <t-form-item label="名称">
          <t-input v-model="form.label" placeholder="麦理浩径" />
        </t-form-item>

        <t-form-item label="封面原图">
          <div class="imprint-types-page__cover-field">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="imprint-types-page__file-input"
              @change="onFileInputChange"
            />
            <t-button variant="outline" @click="pickCoverFile">选择图片</t-button>
            <t-button
              theme="primary"
              variant="outline"
              :loading="coverProcessing"
              @click="processCover"
            >
              处理封面
            </t-button>
            <p class="imprint-types-page__cover-hint">
              请上传<strong>纯白背景 + 六边形实体</strong>的原图，系统会按 1:3:1 比例裁剪并居中。
            </p>
          </div>
        </t-form-item>

        <t-form-item v-if="coverPreviewSrc" label="封面预览">
          <div class="imprint-types-page__preview">
            <t-image
              :src="coverPreviewSrc"
              fit="contain"
              class="imprint-types-page__preview-image"
            />
            <div v-if="coverPreview" class="imprint-types-page__preview-meta">
              <span>六边形 {{ coverPreview.hexWidth }}×{{ coverPreview.hexHeight }}px</span>
              <span>画布 {{ coverPreview.canvasSize }}×{{ coverPreview.canvasSize }}px</span>
            </div>
            <div class="imprint-types-page__preview-actions">
              <t-button
                v-if="canConfirmCover"
                theme="primary"
                :loading="coverConfirming"
                @click="confirmCover"
              >
                确认使用此封面
              </t-button>
              <t-tag v-else-if="coverConfirmed" theme="success" variant="light">封面已确认</t-tag>
              <t-tag v-else-if="coverPreview" theme="warning" variant="light">请先确认封面后再保存</t-tag>
            </div>
          </div>
        </t-form-item>

        <t-form-item label="封面路径">
          <t-input v-model="form.coverPath" placeholder="/imprint-types/maolihao.png" readonly />
        </t-form-item>
        <t-form-item v-if="coverInfo" label="封面信息">
          <div class="imprint-types-page__drawer-cover-meta">
            <span class="imprint-types-page__cover-name" :title="coverInfo.filename">{{ coverInfo.filename }}</span>
            <span>{{ formatBytes(coverInfo.sizeBytes) }}</span>
          </div>
        </t-form-item>

        <t-form-item label="排序">
          <t-input-number v-model="form.sortOrder" :min="0" :max="9999" theme="column" />
        </t-form-item>
        <t-form-item label="启用">
          <t-switch v-model="form.enabled" />
        </t-form-item>
      </t-form>
    </t-drawer>
  </div>
</template>

<style scoped>
.imprint-types-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.imprint-types-page__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.imprint-types-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.imprint-types-page__cover {
  width: 56px;
  height: 56px;
  border-radius: 6px;
}

.imprint-types-page__cover-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.imprint-types-page__cover-meta,
.imprint-types-page__drawer-cover-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--td-text-color-secondary);
}

.imprint-types-page__cover-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imprint-types-page__cover-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.imprint-types-page__file-input {
  display: none;
}

.imprint-types-page__cover-hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--td-text-color-secondary);
}

.imprint-types-page__preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.imprint-types-page__preview-image {
  width: 160px;
  height: 160px;
  border: 1px solid var(--td-component-border);
  border-radius: 8px;
  background: #fff;
}

.imprint-types-page__preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.imprint-types-page__preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
