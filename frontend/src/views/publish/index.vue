<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImprintStore } from '@/stores/imprint'
import {
  Navbar as TNavbar,
  Switch as TSwitch,
  Cell as TCell,
  Button as TButton,
  Toast,
} from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import PublishImageRow from '@/components/publish/image-row/index.vue'
import { usePublishDraft } from './hooks'
import { MOCK_IMAGES } from '@/mock'
import { MOCK_LOCATION, SUBMIT_DELAY_MS } from './const'

const router = useRouter()
const route = useRoute()
const imprintStore = useImprintStore()
const { draft, addImage, removeImage } = usePublishDraft()
const submitting = ref(false)

const editId = computed(() => {
  const id = route.query.id
  return typeof id === 'string' && id.length > 0 ? id : null
})

const pageTitle = computed(() => (editId.value ? '编辑印记' : '封存印记'))

onMounted(() => {
  if (!editId.value) return
  const item = imprintStore.getById(editId.value)
  if (!item) return
  draft.title = item.title
  draft.isPublic = item.isPublic
  if (!draft.imageUrls.length) {
    draft.imageUrls.push(item.coverUrl)
  }
})

function goBack() {
  router.back()
}

function onAddImage() {
  addImage(MOCK_IMAGES.mountain)
}

function onPickLocation() {
  draft.location = MOCK_LOCATION
  Toast({ message: '已选择示例地点（Mock）' })
}

async function onSubmit() {
  if (!draft.title.trim()) {
    Toast({ message: '请填写标题' })
    return
  }
  submitting.value = true
  await new Promise((r) => setTimeout(r, SUBMIT_DELAY_MS))
  submitting.value = false
  if (editId.value) {
    imprintStore.updateItem(editId.value, {
      title: draft.title.trim(),
      isPublic: draft.isPublic,
    })
    Toast({ message: '印记已更新（Mock）' })
  } else {
    Toast({ message: '感应链接已生成（Mock）' })
  }
  router.push({ name: 'home' })
}
</script>

<template>
  <MobilePage>
    <TNavbar :title="pageTitle" left-arrow @left-click="goBack" />
    <div class="publish">
      <PublishImageRow
        :images="draft.imageUrls"
        @add="onAddImage"
        @remove="removeImage"
      />
      <input
        v-model="draft.title"
        class="publish__title"
        type="text"
        placeholder="填写标题..."
        maxlength="60"
      />
      <textarea
        v-model="draft.description"
        class="publish__desc"
        placeholder="分享这块印记的故事..."
        rows="4"
      />
      <div class="publish__config">
        <TCell
          title="添加地点"
          :note="draft.location || undefined"
          arrow
          @click="onPickLocation"
        />
        <TCell title="设为公开展示">
          <template #right-icon>
            <TSwitch v-model="draft.isPublic" @click.stop />
          </template>
        </TCell>
      </div>
    </div>
    <div class="publish__footer">
      <TButton
        block
        theme="primary"
        shape="round"
        size="large"
        :loading="submitting"
        @click="onSubmit"
      >
        生成感应链接
      </TButton>
    </div>
  </MobilePage>
</template>

<style scoped>
.publish {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px var(--tm-spacing-page-x) 16px;
}

.publish__title {
  width: 100%;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 22px;
  font-weight: 600;
  background: transparent;
  color: var(--tm-color-text-primary);
}

.publish__title::placeholder {
  color: var(--tm-color-text-hint);
}

.publish__desc {
  width: 100%;
  min-height: 72px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  background: transparent;
  color: var(--tm-color-text-primary);
}

.publish__desc::placeholder {
  color: var(--tm-color-text-hint);
}

.publish__config {
  border-top: 1px solid var(--tm-color-border-subtle);
}

.publish__config :deep(.t-cell) {
  padding-left: 0;
  padding-right: 0;
}

.publish__footer {
  position: sticky;
  bottom: 0;
  padding: 0 var(--tm-spacing-page-x) calc(34px + env(safe-area-inset-bottom, 0px));
  background: var(--tm-color-bg-page);
}

.publish__footer :deep(.t-button) {
  --td-button-primary-bg-color: var(--tm-color-cta-primary);
  --td-button-primary-color: var(--tm-color-cta-on-primary);
  height: 52px;
  font-size: 16px;
  font-weight: 600;
}
</style>
