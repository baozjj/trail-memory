export interface ProfileSettingsRowProps {
  label: string
  modelValue: boolean
}

export interface ProfileSettingsRowEmits {
  'update:modelValue': [value: boolean]
}
