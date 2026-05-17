<script setup lang="ts">
import { computed } from 'vue'
import { AddIcon } from 'tdesign-icons-vue-next'
import { MOCK_IMAGES } from '@/mock'

const props = defineProps<{
  images: string[]
  maxCount?: number
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()

const maxCount = computed(() => props.maxCount ?? 9)
const isOverflow = computed(() => props.images.length >= 3)
const addBtnWidth = computed(() => (isOverflow.value ? 48 : 96))
</script>

<template>
  <div class="image-row">
    <div class="image-row__scroll" :class="{ 'image-row__scroll--clip': isOverflow }">
      <button
        v-for="(url, index) in images"
        :key="`${url}-${index}`"
        type="button"
        class="image-cell"
        @click="emit('remove', index)"
      >
        <img :src="url" alt="" />
      </button>
    </div>
    <button
      v-if="images.length < maxCount"
      type="button"
      class="add-btn"
      :style="{ width: `${addBtnWidth}px` }"
      aria-label="添加图片"
      @click="emit('add')"
    >
      <AddIcon />
    </button>
  </div>
</template>

<style scoped>
.image-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 96px;
}

.image-row__scroll {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.image-row__scroll--clip {
  overflow: hidden;
}

.image-row__scroll::-webkit-scrollbar {
  display: none;
}

.image-cell {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  padding: 0;
  border: none;
  border-radius: var(--tm-radius-card);
  overflow: hidden;
  cursor: pointer;
  background: var(--tm-color-bg-muted);
}

.image-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  padding: 0;
  border: none;
  border-radius: var(--tm-radius-card);
  background: var(--tm-color-bg-muted);
  color: var(--tm-color-icon-inactive);
  cursor: pointer;
}

.add-btn :deep(svg) {
  width: 28px;
  height: 28px;
}
</style>
