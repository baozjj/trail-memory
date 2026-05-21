<script setup lang="ts">
import { computed } from 'vue'
import { ActionSheet as TActionSheet } from 'tdesign-mobile-vue'
import {
  MENU_COPY_LINK,
  MENU_DELETE,
  MENU_EDIT,
  MENU_EXHIBIT,
} from './const'
import type { CardActionKey, CardActionSheetEmits, CardActionSheetProps } from './types'

const props = defineProps<CardActionSheetProps>()
const emit = defineEmits<CardActionSheetEmits>()

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

const menuItems = [
  { label: MENU_COPY_LINK },
  { label: MENU_EXHIBIT },
  { label: MENU_EDIT },
  { label: MENU_DELETE, color: '#ff3b30' },
]

const actionKeys: CardActionKey[] = ['copy', 'exhibit', 'edit', 'delete']

function onSelected(_item: unknown, index: number) {
  const key = actionKeys[index]
  if (!key) return
  visible.value = false
  emit('action', key)
}
</script>

<template>
  <TActionSheet
    v-model="visible"
    :items="menuItems"
    theme="list"
    :show-cancel="true"
    cancel-text="取消"
    :popup-props="{ closeOnOverlayClick: true }"
    @selected="onSelected"
  />
</template>
