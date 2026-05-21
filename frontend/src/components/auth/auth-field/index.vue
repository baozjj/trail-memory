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
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--tm-auth-muted, #86868b);
}

.auth-field__input :deep(.t-input) {
  --td-input-bg-color: var(--tm-auth-surface, #f5f5f7);
  --td-input-border-color: transparent;
  --td-input-vertical-padding: 14px 16px;
  --td-font-size-m: 17px;
  --td-input-placeholder-text-color: #aeaeb2;
  --td-input-default-text-color: var(--tm-color-text-primary);
  border-radius: var(--tm-auth-radius, 12px);
  transition: background-color 0.2s ease;
}

.auth-field__input :deep(.t-input--focused) {
  --td-input-bg-color: var(--tm-auth-surface-focus, #ebebed);
}
</style>
