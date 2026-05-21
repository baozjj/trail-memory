<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Popup as TPopup, Switch as TSwitch, Button as TButton } from 'tdesign-mobile-vue'
import { imprintLinkPrefix, sanitizeLinkSuffix } from '@/utils/imprint-link'
import {
  PUBLIC_LABEL,
  SAVE_BUTTON_TEXT,
  SHEET_TITLE,
  SUFFIX_LABEL,
  SUFFIX_WARNING,
} from './const'
import type {
  ExhibitSettingsSheetEmits,
  ExhibitSettingsSheetProps,
} from './types'

const props = defineProps<ExhibitSettingsSheetProps>()
const emit = defineEmits<ExhibitSettingsSheetEmits>()

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

const isPublic = ref(true)
const linkSuffix = ref('')

watch(
  () => props.item,
  (item) => {
    if (!item) return
    isPublic.value = item.isPublic
    linkSuffix.value = item.linkSuffix
  },
  { immediate: true },
)

const lockedPrefix = computed(() =>
  props.item ? imprintLinkPrefix(props.item.id) : '/m/-',
)

function onSuffixInput(event: Event) {
  const target = event.target as HTMLInputElement
  linkSuffix.value = sanitizeLinkSuffix(target.value)
  target.value = linkSuffix.value
}

function onSave() {
  if (!props.item) return
  emit('save', {
    isPublic: isPublic.value,
    linkSuffix: linkSuffix.value,
  })
}
</script>

<template>
  <TPopup v-model:visible="visible" placement="bottom" :close-on-overlay-click="true">
    <div class="exhibit-sheet tm-sheet-panel" aria-labelledby="exhibit-sheet-title">
      <h2 id="exhibit-sheet-title" class="exhibit-sheet__title tm-sheet-title">{{ SHEET_TITLE }}</h2>

      <div class="exhibit-sheet__row">
        <span class="exhibit-sheet__label">{{ PUBLIC_LABEL }}</span>
        <TSwitch v-model="isPublic" />
      </div>

      <div class="exhibit-sheet__field">
        <span class="exhibit-sheet__label">{{ SUFFIX_LABEL }}</span>
        <div class="exhibit-sheet__input-wrap tm-surface-field">
          <span class="exhibit-sheet__prefix">{{ lockedPrefix }}</span>
          <input
            class="exhibit-sheet__input"
            type="text"
            inputmode="text"
            autocomplete="off"
            :value="linkSuffix"
            @input="onSuffixInput"
          />
        </div>
        <p class="exhibit-sheet__warning tm-warning-banner">{{ SUFFIX_WARNING }}</p>
      </div>

      <TButton
        block
        theme="primary"
        size="large"
        class="exhibit-sheet__save tm-btn-primary"
        @click="onSave"
      >
        {{ SAVE_BUTTON_TEXT }}
      </TButton>
    </div>
  </TPopup>
</template>

<style scoped>
.exhibit-sheet__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--tm-color-border-subtle);
}

.exhibit-sheet__field {
  padding: 16px 0 8px;
}

.exhibit-sheet__label {
  display: block;
  margin-bottom: 10px;
  font-size: var(--tm-font-size-subhead);
  font-weight: 500;
  color: var(--tm-color-text-secondary);
}

.exhibit-sheet__row .exhibit-sheet__label {
  margin-bottom: 0;
}

.exhibit-sheet__input-wrap {
  gap: 0;
}

.exhibit-sheet__prefix {
  flex-shrink: 0;
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-tertiary);
  user-select: none;
}

.exhibit-sheet__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
}

.exhibit-sheet__warning {
  margin: 12px 0 0;
}

.exhibit-sheet__save {
  margin-top: 20px;
}
</style>
