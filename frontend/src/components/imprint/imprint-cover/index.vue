<script setup lang="ts">
import { computed } from 'vue'
import { resolveImprintTypeCoverSrc } from '@/config/imprint-types'
import {
  flatHexAspectRatio,
  flatHexPoints,
  flatHexViewBox,
  HEX_STROKE_WIDTH,
} from './utils'
import type { ImprintCoverProps } from './types'

const props = withDefaults(defineProps<ImprintCoverProps>(), {
  typeId: null,
  alt: '',
})

const coverSrc = computed(() => resolveImprintTypeCoverSrc(props.typeId))
</script>

<template>
  <div
    class="imprint-cover"
    :class="coverSrc ? 'imprint-cover--asset' : 'imprint-cover--placeholder'"
  >
    <img
      v-if="coverSrc"
      class="imprint-cover__image"
      :src="coverSrc"
      :alt="alt"
      loading="lazy"
    />
    <template v-else>
      <div class="imprint-cover__hex-bounds" aria-hidden="true">
        <svg
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
            stroke="var(--imprint-cover-hex-stroke, var(--tm-color-icon-inactive))"
            :stroke-width="HEX_STROKE_WIDTH"
            stroke-linejoin="round"
            stroke-miterlimit="1"
            shape-rendering="geometricPrecision"
          />
        </svg>
      </div>
    </template>
  </div>
</template>

<style scoped>
.imprint-cover {
  position: absolute;
  inset: 0;
  background: var(--tm-color-bg-page, #ffffff);
}

/**
 * 类型封面 PNG 已按「顶底各 1/5、中间 3/5」烘进正方形画布，整图 contain 即可。
 */
.imprint-cover--asset .imprint-cover__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/**
 * 线框占位：在容器内划出顶 20% / 中 60% / 底 20%，六边形居中于中间区域。
 * 使用绝对定位而非 grid，避免移动端在 padding-box 内 grid 失效。
 */
.imprint-cover--placeholder .imprint-cover__hex-bounds {
  position: absolute;
  left: 0;
  right: 0;
  top: 20%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.imprint-cover__hex {
  display: block;
  height: 100%;
  width: auto;
  max-width: 100%;
  aspect-ratio: v-bind(flatHexAspectRatio);
}
</style>
