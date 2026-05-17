<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Navbar as TNavbar,
  Switch as TSwitch,
  Cell as TCell,
  Button as TButton,
  Toast,
} from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/MobilePage.vue'
import PublishImageRow from '@/components/publish/PublishImageRow.vue'
import { usePublishDraft } from '@/composables/usePublishDraft'
import { MOCK_IMAGES } from '@/mock'

const router = useRouter()
const { draft, addImage, removeImage } = usePublishDraft()
const submitting = ref(false)

function goBack() {
  router.back()
}

function onAddImage() {
  addImage(MOCK_IMAGES.mountain)
}

function onPickLocation() {
  draft.location = '四川·稻城亚丁'
  Toast({ message: '已选择示例地点（Mock）' })
}

async function onSubmit() {
  if (!draft.title.trim()) {
    Toast({ message: '请填写标题' })
    return
  }
  submitting.value = true
  await new Promise((r) => setTimeout(r, 600))
  submitting.value = false
  Toast({ message: '感应链接已生成（Mock）' })
  router.push({ name: 'home' })
}
</script>

<template>
  <MobilePage>
    <TNavbar title="封存印记" left-arrow @left-click="goBack" />
    <main class="publish">
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
      <section class="publish__config">
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
      </section>
    </main>
    <footer class="publish__footer">
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
    </footer>
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
