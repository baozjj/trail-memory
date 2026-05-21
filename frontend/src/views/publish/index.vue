<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Navbar as TNavbar,
  Switch as TSwitch,
  Cell as TCell,
  Button as TButton,
  Dialog as TDialog,
  Toast,
} from 'tdesign-mobile-vue'
import { CopyIcon } from 'tdesign-icons-vue-next'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import PublishImageRow from '@/components/publish/image-row/index.vue'
import PublishTypePicker from '@/components/publish/type-picker/index.vue'
import PublishDatePicker from '@/components/publish/date-picker/index.vue'
import { SUFFIX_LABEL, SUFFIX_WARNING } from '@/components/imprint/exhibit-settings-sheet/const'
import { imprintLinkPrefix, sanitizeLinkSuffix } from '@/utils/imprint-link'
import { copyTextToClipboard } from '@/utils/clipboard'
import { getApiErrorMessage } from '@/api/axios'
import { usePublishDraft } from './hooks'
import { usePublishSubmit } from './hooks/use-publish-submit'
import {
  COPY_SUCCESS_TOAST,
  EDIT_SUBMIT_BUTTON_LABEL,
  SUBMIT_BUTTON_LABEL,
  SUCCESS_DIALOG_HINT,
  SUCCESS_DIALOG_TITLE,
  SUCCESS_DIALOG_TITLE_ICON,
} from './const'

const router = useRouter()
const route = useRoute()
const { draft, pickFromAlbum } = usePublishDraft()
const { submitting, loadingDetail, loadEditDetail, submit } = usePublishSubmit()

const successDialogVisible = ref(false)
const shareLink = ref('')
const linkSuffix = ref('')

const editId = computed(() => {
  const id = route.query.id
  return typeof id === 'string' && id.length > 0 ? id : null
})

const isEditMode = computed(() => Boolean(editId.value))
const pageTitle = computed(() => (isEditMode.value ? '编辑印记' : '封存印记'))
const submitButtonLabel = computed(() =>
  isEditMode.value ? EDIT_SUBMIT_BUTTON_LABEL : SUBMIT_BUTTON_LABEL,
)
const lockedLinkPrefix = computed(() => (editId.value ? imprintLinkPrefix(editId.value) : '/m/-'))

onMounted(() => {
  if (!editId.value) return
  void loadEditDetail(editId.value, draft)
    .then((suffix) => {
      linkSuffix.value = suffix
    })
    .catch((error: unknown) => {
      Toast({ message: getApiErrorMessage(error, '加载印记失败') })
      router.back()
    })
})

function goBack() {
  router.back()
}

async function onAddImage() {
  await pickFromAlbum()
}

function onSuffixInput(event: Event) {
  const target = event.target as HTMLInputElement
  linkSuffix.value = sanitizeLinkSuffix(target.value)
  target.value = linkSuffix.value
}

async function onSubmit() {
  const link = await submit({
    editId: editId.value,
    draft,
    linkSuffix: linkSuffix.value,
  })
  if (!link) return

  shareLink.value = link
  successDialogVisible.value = true
}

async function onCopyShareLink() {
  if (!shareLink.value) return
  const ok = await copyTextToClipboard(shareLink.value)
  Toast({ message: ok ? COPY_SUCCESS_TOAST : '复制失败，请重试' })
}

function onSuccessDialogClosed() {
  successDialogVisible.value = false
  router.back()
}
</script>

<template>
  <MobilePage>
    <TNavbar :title="pageTitle" left-arrow placeholder @left-click="goBack" />
    <div v-if="loadingDetail" class="publish__loading">加载中...</div>
    <div v-else class="publish">
      <PublishImageRow v-model:images="draft.imageUrls" @add="onAddImage" />
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
        <PublishTypePicker v-model="draft.typeId" />
        <PublishDatePicker v-model="draft.sealedDate" />
        <TCell title="设为公开展示">
          <template #right-icon>
            <TSwitch v-model="draft.isPublic" @click.stop />
          </template>
        </TCell>
      </div>
    </div>
    <div class="publish__footer">
      <div v-if="isEditMode" class="publish__suffix">
        <span class="publish__suffix-label">{{ SUFFIX_LABEL }}</span>
        <div class="publish__suffix-input-wrap tm-surface-field">
          <span class="publish__suffix-prefix">{{ lockedLinkPrefix }}</span>
          <input
            class="publish__suffix-input"
            type="text"
            inputmode="text"
            autocomplete="off"
            :value="linkSuffix"
            @input="onSuffixInput"
          />
        </div>
        <p class="publish__suffix-warning tm-warning-banner">{{ SUFFIX_WARNING }}</p>
      </div>
      <TButton
        class="publish__submit tm-btn-primary"
        block
        theme="primary"
        size="large"
        :loading="submitting"
        :disabled="loadingDetail"
        @click="onSubmit"
      >
        {{ submitButtonLabel }}
      </TButton>
    </div>

    <TDialog
      v-model:visible="successDialogVisible"
      class="publish-success-dialog"
      :confirm-btn="null"
      :cancel-btn="null"
      :close-btn="true"
      :close-on-overlay-click="true"
      destroy-on-close
      @closed="onSuccessDialogClosed"
    >
      <div class="publish-success-dialog__body">
        <h2 class="publish-success-dialog__title">
          <span class="publish-success-dialog__title-text">{{ SUCCESS_DIALOG_TITLE }}</span>
          <span class="publish-success-dialog__title-icon" aria-hidden="true">{{
            SUCCESS_DIALOG_TITLE_ICON
          }}</span>
        </h2>
        <p class="publish-success-dialog__hint">{{ SUCCESS_DIALOG_HINT }}</p>
        <div class="publish-success-dialog__link-bar">
          <span class="publish-success-dialog__url">{{ shareLink }}</span>
          <button
            type="button"
            class="publish-success-dialog__copy"
            aria-label="复制链接"
            @click="onCopyShareLink"
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    </TDialog>
  </MobilePage>
</template>

<style scoped>
.publish__loading {
  padding: var(--tm-spacing-section) var(--tm-spacing-page-x);
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-tertiary);
  text-align: center;
}

.publish {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 12px var(--tm-spacing-page-x) 16px;
}

.publish__title {
  width: 100%;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: var(--tm-font-size-title-sm);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-tight);
  background: transparent;
  color: var(--tm-color-text-primary);
}

.publish__title::placeholder {
  color: var(--tm-color-text-hint);
}

.publish__desc {
  width: 100%;
  min-height: 80px;
  border: none;
  outline: none;
  resize: none;
  font-size: var(--tm-font-size-subhead);
  line-height: 1.6;
  letter-spacing: var(--tm-letter-spacing-normal);
  background: transparent;
  color: var(--tm-color-text-primary);
}

.publish__desc::placeholder {
  color: var(--tm-color-text-hint);
}

.publish__config {
  margin-top: 4px;
  border-top: 1px solid var(--tm-color-border-subtle);
}

.publish__config :deep(.t-cell) {
  padding-left: 0;
  padding-right: 0;
  font-size: var(--tm-font-size-subhead);
}

.publish__footer {
  position: sticky;
  bottom: 0;
  padding: 12px var(--tm-spacing-page-x) calc(28px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    var(--tm-color-bg-page) 24%
  );
}

.publish__suffix {
  padding-bottom: 16px;
}

.publish__suffix-label {
  display: block;
  margin-bottom: 10px;
  font-size: var(--tm-font-size-subhead);
  font-weight: 500;
  color: var(--tm-color-text-secondary);
}

.publish__suffix-input-wrap {
  gap: 0;
}

.publish__suffix-prefix {
  flex-shrink: 0;
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-tertiary);
  user-select: none;
}

.publish__suffix-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
}

.publish__suffix-warning {
  margin: 12px 0 0;
}

.publish-success-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 8px 4px 4px;
  text-align: center;
}

.publish-success-dialog__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0;
  font-size: var(--tm-font-size-body);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-normal);
  line-height: 1;
  color: var(--tm-color-text-primary);
}

.publish-success-dialog__title-text {
  line-height: 1.4;
}

.publish-success-dialog__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--tm-font-size-subhead);
  line-height: 1;
}

.publish-success-dialog__hint {
  margin: 0;
  font-size: var(--tm-font-size-footnote);
  line-height: 1.5;
  color: var(--tm-color-text-tertiary);
}

.publish-success-dialog__link-bar {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
  padding: 12px 14px;
  border-radius: var(--tm-radius-md);
  background: var(--tm-color-bg-surface);
}

.publish-success-dialog__url {
  flex: 1;
  min-width: 0;
  font-size: var(--tm-font-size-footnote);
  line-height: 1.45;
  color: var(--tm-color-text-secondary);
  text-align: left;
  overflow: hidden;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.publish-success-dialog__copy {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--tm-radius-sm);
  background: transparent;
  color: var(--tm-color-link);
  cursor: pointer;
}

.publish-success-dialog__copy:active {
  background: var(--tm-color-bg-surface);
}

.publish-success-dialog__copy :deep(svg) {
  width: 20px;
  height: 20px;
}

.publish-success-dialog :deep(.t-dialog__footer) {
  display: none;
}

.publish-success-dialog :deep(.t-dialog__body-text) {
  padding: 0;
}
</style>
