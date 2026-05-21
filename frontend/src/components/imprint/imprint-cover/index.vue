<script setup lang="ts">
import { computed } from 'vue'
import { resolveImprintTypeCoverSrc } from '@/config/imprint-types'
import { flatHexAspectRatio, flatHexPoints, flatHexViewBox } from './utils'
import type { ImprintCoverProps } from './types'

const props = withDefaults(defineProps<ImprintCoverProps>(), {
  typeId: null,
  alt: '',
})

const coverSrc = computed(() => resolveImprintTypeCoverSrc(props.typeId))
</script>

<template>
  <div class="imprint-cover" :class="{ 'imprint-cover--placeholder': !coverSrc }">
    <img
      v-if="coverSrc"
      class="imprint-cover__image"
      :src="coverSrc"
      :alt="alt"
      loading="lazy"
    />
    <svg
      v-else
      class="imprint-cover__hex"
      :viewBox="flatHexViewBox"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="alt || '未选择类型'"
    >
      <polygon
        :points="flatHexPoints"
        fill="var(--imprint-cover-hex-fill, #ffffff)"
        stroke="var(--imprint-cover-hex-stroke, #c8c8c8)"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.imprint-cover {
  position: absolute;
  inset: 0;
}

.imprint-cover--placeholder {
  display: grid;
  grid-template-rows: 1fr 3fr 1fr;
  align-items: center;
  justify-items: center;
  background: var(--tm-color-bg-page, #ffffff);
}

.imprint-cover__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imprint-cover__hex {
  grid-row: 2;
  display: block;
  height: 100%;
  width: auto;
  max-width: 100%;
  aspect-ratio: v-bind(flatHexAspectRatio);
}
</style>
