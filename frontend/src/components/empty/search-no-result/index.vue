<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next'
import { CLEAR_SEARCH_LABEL, SEARCH_NO_RESULT_TEXT } from './const'

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <div class="search-no-result">
    <SearchIcon class="search-no-result__icon" aria-hidden="true" />
    <p class="search-no-result__text">{{ SEARCH_NO_RESULT_TEXT }}</p>
    <button type="button" class="search-no-result__btn" @click="emit('clear')">
      {{ CLEAR_SEARCH_LABEL }}
    </button>
  </div>
</template>

<style scoped>
.search-no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px var(--tm-spacing-section) 100px;
  min-height: 50vh;
}

.search-no-result__icon {
  width: 40px;
  height: 40px;
  color: var(--tm-color-icon-inactive);
}

.search-no-result__text {
  margin: 0;
  font-size: var(--tm-font-size-subhead);
  line-height: 1.5;
  color: var(--tm-color-text-tertiary);
}

.search-no-result__btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--tm-radius-chip);
  background: var(--tm-color-bg-surface);
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-primary);
  cursor: pointer;
  transition: background-color var(--tm-duration-fast) ease;
}

.search-no-result__btn:active {
  background: var(--tm-color-bg-surface-active);
}
</style>
