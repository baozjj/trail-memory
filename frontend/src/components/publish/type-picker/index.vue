<script setup lang="ts">
import { computed, ref } from 'vue'
import { Cell as TCell, Picker as TPicker, Popup as TPopup } from 'tdesign-mobile-vue'
import {
  getEnabledImprintTypes,
  getImprintTypeLabel,
} from '@/config/imprint-types'
import { TYPE_CELL_TITLE, TYPE_CLEAR_LABEL, TYPE_PLACEHOLDER } from './const'
import type { PublishTypePickerEmits, PublishTypePickerProps } from './types'

const props = defineProps<PublishTypePickerProps>()
const emit = defineEmits<PublishTypePickerEmits>()

const pickerVisible = ref(false)

const displayNote = computed(() => {
  const label = getImprintTypeLabel(props.modelValue)
  return label ?? TYPE_PLACEHOLDER
})

const pickerColumns = computed(() => [
  [
    { label: TYPE_CLEAR_LABEL, value: '' },
    ...getEnabledImprintTypes().map((item) => ({
      label: item.label,
      value: item.id,
    })),
  ],
])

const pickerValue = computed(() => [props.modelValue ?? ''])

function openPicker() {
  pickerVisible.value = true
}

function onPickerConfirm(value: (string | number)[]) {
  const raw = String(value[0] ?? '')
  emit('update:modelValue', raw ? raw : null)
  pickerVisible.value = false
}

function onPickerCancel() {
  pickerVisible.value = false
}
</script>

<template>
  <TCell :title="TYPE_CELL_TITLE" arrow class="tm-cell-pressable" @click="openPicker">
    <template #note>
      <span
        class="publish-type-picker__note"
        :class="{ 'publish-type-picker__note--placeholder': !modelValue }"
      >
        {{ displayNote }}
      </span>
    </template>
  </TCell>

  <TPopup v-model:visible="pickerVisible" placement="bottom">
    <TPicker
      :value="pickerValue"
      :columns="pickerColumns"
      title="选择印记类型"
      @confirm="onPickerConfirm"
      @cancel="onPickerCancel"
    />
  </TPopup>
</template>

<style scoped>
.publish-type-picker__note {
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
}

.publish-type-picker__note--placeholder {
  color: var(--tm-color-text-tertiary);
}
</style>
