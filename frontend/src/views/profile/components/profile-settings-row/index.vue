<script setup lang="ts">
import { computed } from 'vue'
import { Switch as TSwitch } from 'tdesign-mobile-vue'
import type { ProfileSettingsRowEmits, ProfileSettingsRowProps } from './types'

const props = defineProps<ProfileSettingsRowProps>()
const emit = defineEmits<ProfileSettingsRowEmits>()

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="profile-settings-row">
    <span class="profile-settings-row__label">{{ label }}</span>
    <TSwitch v-model="checked" />
  </div>
</template>

<style scoped>
.profile-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 0 2px;
}

.profile-settings-row__label {
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
}
</style>
