<script setup lang="ts">
import { STATS_LABEL_PREFIX, STATS_LABEL_SUFFIX } from '../../const'
import type { ProfileStatsProps } from './types'

defineProps<ProfileStatsProps>()
</script>

<template>
  <section class="profile-stats" aria-label="印记统计">
    <p class="profile-stats__row">
      <span class="profile-stats__label">{{ STATS_LABEL_PREFIX }}</span>
      <span class="profile-stats__count">{{ count }}</span>
      <span class="profile-stats__label">{{ STATS_LABEL_SUFFIX }}</span>
    </p>
  </section>
</template>

<style scoped>
.profile-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 40px;
}

.profile-stats__row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  margin: 0;
}

.profile-stats__label {
  font-size: var(--tm-font-size-subhead);
  line-height: 1.4;
  color: var(--tm-color-text-tertiary);
}

.profile-stats__count {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-tight);
  line-height: 1;
  color: var(--tm-color-text-primary);
}
</style>
