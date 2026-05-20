<script setup lang="ts">
import { computed } from 'vue'
import { resolveImprintTypeCoverSrc } from '@/config/imprint-types'
import type { ImprintCoverProps } from './types'

const props = withDefaults(defineProps<ImprintCoverProps>(), {
  typeId: null,
  alt: '',
})

const coverSrc = computed(() => resolveImprintTypeCoverSrc(props.typeId))
</script>

<template>
  <div class="imprint-cover">
    <img
      v-if="coverSrc"
      class="imprint-cover__image"
      :src="coverSrc"
      :alt="alt"
      loading="lazy"
    />
    <div
      v-else
      class="imprint-cover__hex"
      role="img"
      :aria-label="alt || '未选择类型'"
    />
  </div>
</template>

<style scoped>
.imprint-cover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imprint-cover__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imprint-cover__hex {
  width: 52%;
  max-width: 120px;
  aspect-ratio: 1;
  background: #d4d4d4;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
</style>
