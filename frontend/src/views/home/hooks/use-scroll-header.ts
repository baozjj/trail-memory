import { computed, ref, watch, type Ref } from 'vue'
import { useDebounceFn, useElementSize, useWindowScroll } from '@vueuse/core'
import {
  HEADER_ALWAYS_VISIBLE_TOP,
  HEADER_HIDE_SCROLL_DELTA,
  HEADER_SCROLL_EDGE_OFFSET,
  HEADER_SCROLL_SETTLE_MS,
} from '../const'

type ScrollDirection = 'up' | 'down' | null

/**
 * 顶栏随窗口滚动收起/展开：固定定位 + 等高占位；
 * 状态切换带 transform 过渡；停止滚动后吸附为完全显示或完全隐藏。
 */
export function useHomeScrollHeader(headerRef: Ref<HTMLElement | null>) {
  const headerVisible = ref(true)

  const { height: headerHeight } = useElementSize(headerRef)
  const spacerHeight = computed(() => Math.max(0, Math.round(headerHeight.value)))

  const { y, arrivedState } = useWindowScroll({
    offset: {
      top: HEADER_ALWAYS_VISIBLE_TOP,
      bottom: HEADER_SCROLL_EDGE_OFFSET,
    },
  })

  let lastScrollY = 0
  let accumulatedDelta = 0
  let lastDirection: ScrollDirection = null

  function resetScrollTracking(scrollY = y.value) {
    lastScrollY = scrollY
    accumulatedDelta = 0
  }

  function trackDirection(delta: number) {
    if (delta > 0) {
      lastDirection = 'down'
    } else if (delta < 0) {
      lastDirection = 'up'
    }
  }

  function setHeaderVisible(visible: boolean) {
    if (headerVisible.value !== visible) {
      headerVisible.value = visible
    }
  }

  /** 触顶/触底时浏览器橡皮筋回弹，scrollY 会短暂反向变化，不应算作用户手势 */
  function isEdgeRubberBandBounce(delta: number): boolean {
    if (delta < 0 && arrivedState.bottom) {
      return true
    }
    if (delta > 0 && arrivedState.top) {
      return true
    }
    return false
  }

  function resolveVisibilityFromGesture() {
    if (arrivedState.top || y.value <= HEADER_ALWAYS_VISIBLE_TOP) {
      return true
    }

    // 停在底部时，回弹造成的「向上」不展开顶栏
    if (arrivedState.bottom) {
      return headerVisible.value
    }

    if (lastDirection === 'up') {
      return true
    }
    if (lastDirection === 'down' && accumulatedDelta >= HEADER_HIDE_SCROLL_DELTA) {
      return false
    }
    return headerVisible.value
  }

  function applySettledVisibility() {
    setHeaderVisible(resolveVisibilityFromGesture())
    resetScrollTracking()
  }

  const settleVisibility = useDebounceFn(applySettledVisibility, HEADER_SCROLL_SETTLE_MS)

  watch(y, (currentY) => {
    if (arrivedState.top || currentY <= HEADER_ALWAYS_VISIBLE_TOP) {
      setHeaderVisible(true)
      lastDirection = null
      resetScrollTracking(currentY)
      settleVisibility()
      return
    }

    const delta = currentY - lastScrollY
    if (delta === 0) {
      settleVisibility()
      return
    }

    lastScrollY = currentY

    if (isEdgeRubberBandBounce(delta)) {
      settleVisibility()
      return
    }

    trackDirection(delta)

    if ((delta > 0 && accumulatedDelta < 0) || (delta < 0 && accumulatedDelta > 0)) {
      accumulatedDelta = 0
    }
    accumulatedDelta += delta

    setHeaderVisible(resolveVisibilityFromGesture())
    settleVisibility()
  })

  return {
    headerVisible,
    spacerHeight,
  }
}
