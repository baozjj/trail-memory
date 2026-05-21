<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Cell as TCell,
  DateTimePicker as TDateTimePicker,
  Popup as TPopup,
} from 'tdesign-mobile-vue'
import {
  formatIsoDateToDisplay,
  isoDateToTimestamp,
  timestampToIsoDate,
  todayIsoDate,
} from '@/utils/imprint-date'
import { DATE_CELL_TITLE, DATE_PICKER_TITLE, DATE_PLACEHOLDER } from './const'
import type { PublishDatePickerEmits, PublishDatePickerProps } from './types'

const props = defineProps<PublishDatePickerProps>()
const emit = defineEmits<PublishDatePickerEmits>()

const pickerVisible = ref(false)

const displayNote = computed(() => {
  const label = formatIsoDateToDisplay(props.modelValue)
  return label || DATE_PLACEHOLDER
})

const pickerValue = computed(() =>
  isoDateToTimestamp(props.modelValue || todayIsoDate()),
)

function openPicker() {
  pickerVisible.value = true
}

function onPickerConfirm(value: string | number) {
  emit('update:modelValue', timestampToIsoDate(value))
  pickerVisible.value = false
}

function onPickerCancel() {
  pickerVisible.value = false
}
</script>

<template>
  <TCell :title="DATE_CELL_TITLE" arrow hover @click="openPicker">
    <template #note>
      <span
        class="publish-date-picker__note"
        :class="{ 'publish-date-picker__note--placeholder': !modelValue }"
      >
        {{ displayNote }}
      </span>
    </template>
  </TCell>

  <TPopup v-model:visible="pickerVisible" placement="bottom">
    <TDateTimePicker
      :value="pickerValue"
      mode="date"
      format="YYYY-MM-DD"
      :title="DATE_PICKER_TITLE"
      @confirm="onPickerConfirm"
      @cancel="onPickerCancel"
    />
  </TPopup>
</template>

<style scoped>
.publish-date-picker__note {
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
}

.publish-date-picker__note--placeholder {
  color: var(--tm-color-text-tertiary);
}
</style>
