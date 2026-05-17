<script setup lang="ts">
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'
import { SEARCH_PLACEHOLDER } from './const'

const keyword = defineModel<string>('keyword', { default: '' })

const router = useRouter()

function goPublish() {
  router.push({ name: 'publish' })
}
</script>

<template>
  <div class="imprint-header">
    <div class="search-box">
      <SearchIcon class="search-icon" />
      <input
        v-model="keyword"
        type="search"
        class="search-input"
        :placeholder="SEARCH_PLACEHOLDER"
        enterkeyhint="search"
      />
    </div>
    <button type="button" class="add-btn" aria-label="封存新印记" @click="goPublish">
      <AddIcon />
    </button>
  </div>
</template>

<style scoped>
.imprint-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 20px;
  background: var(--tm-color-bg-muted);
}

.search-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: var(--tm-color-text-placeholder);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--tm-color-text-primary);
}

.search-input::placeholder {
  color: var(--tm-color-text-placeholder);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  margin: -6px -8px -6px 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--tm-color-text-primary);
}

.add-btn :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
