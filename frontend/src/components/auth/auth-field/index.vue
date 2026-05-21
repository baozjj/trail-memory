<script setup lang="ts">
import { Input } from 'tdesign-mobile-vue'
import type { AuthFieldProps } from './types'

withDefaults(defineProps<AuthFieldProps>(), {
  type: 'text',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="auth-field">
    <span class="auth-field__label">{{ label }}</span>
    <Input
      v-model="model"
      class="auth-field__input"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      clearable
      borderless
    />
  </label>
</template>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-field__label {
  padding-left: 4px;
  font-size: var(--tm-font-size-footnote);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--tm-auth-muted);
}

.auth-field__input :deep(.t-input) {
  --td-input-bg-color: var(--tm-auth-surface);
  --td-input-border-color: transparent;
  --td-input-vertical-padding: 14px 16px;
  --td-font-size-m: var(--tm-font-size-input);
  border-radius: var(--tm-auth-radius);
  transition: background-color var(--tm-duration-fast) ease;
}

.auth-field__input :deep(.t-input--focused) {
  --td-input-bg-color: var(--tm-auth-surface-focus);
}
</style>
