<script setup lang="ts">
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'

const keyword = defineModel<string>('keyword', { default: '' })

const router = useRouter()

function goPublish() {
  router.push({ name: 'publish' })
}
</script>

<template>
  <header class="imprint-header">
    <div class="search-box">
      <SearchIcon class="search-icon" />
      <input
        v-model="keyword"
        type="search"
        class="search-input"
        placeholder="搜索印记"
        enterkeyhint="search"
      />
    </div>
    <button type="button" class="add-btn" aria-label="封存新印记" @click="goPublish">
      <AddIcon />
    </button>
  </header>
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
  width: 28px;
  height: 28px;
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
