import {
  ADD_BTN_WIDTH_COMPACT,
  ADD_BTN_WIDTH_FULL,
  DRAG_TRACK_SCROLL_EDGE_PX,
  DRAG_TRACK_SCROLL_MAX_STEP_PX,
  DRAG_TRACK_SCROLL_MIN_STEP_PX,
  IMAGE_CELL_SIZE,
  IMAGE_ROW_GAP,
} from './const'

export interface ImageRowLayout {
  addBtnWidth: number
  isCompactAdd: boolean
  /** 图片区横向滚动 */
  needsScroll: boolean
  /** 宽度不足时加号固定在容器右侧，否则紧跟最后一张图 */
  pinAddBtn: boolean
}

/** 方案 2：按容器宽度计算加号尺寸与图片区是否横向滚动 */
export function computeImageRowLayout(
  containerWidth: number,
  imageCount: number,
  showAddBtn: boolean,
): ImageRowLayout {
  if (containerWidth <= 0) {
    return {
      addBtnWidth: showAddBtn ? ADD_BTN_WIDTH_FULL : 0,
      isCompactAdd: false,
      needsScroll: false,
      pinAddBtn: false,
    }
  }

  if (imageCount === 0) {
    return {
      addBtnWidth: showAddBtn ? ADD_BTN_WIDTH_FULL : 0,
      isCompactAdd: false,
      needsScroll: false,
      pinAddBtn: false,
    }
  }

  const imagesWidth = imageCount * IMAGE_CELL_SIZE + Math.max(0, imageCount - 1) * IMAGE_ROW_GAP

  if (!showAddBtn) {
    const needsScroll = imagesWidth > containerWidth
    return {
      addBtnWidth: 0,
      isCompactAdd: false,
      needsScroll,
      pinAddBtn: false,
    }
  }

  const rowWidthFullAdd = imagesWidth + IMAGE_ROW_GAP + ADD_BTN_WIDTH_FULL
  if (rowWidthFullAdd <= containerWidth) {
    return {
      addBtnWidth: ADD_BTN_WIDTH_FULL,
      isCompactAdd: false,
      needsScroll: false,
      pinAddBtn: false,
    }
  }

  const rowWidthCompactAdd = imagesWidth + IMAGE_ROW_GAP + ADD_BTN_WIDTH_COMPACT
  if (rowWidthCompactAdd <= containerWidth) {
    return {
      addBtnWidth: ADD_BTN_WIDTH_COMPACT,
      isCompactAdd: true,
      needsScroll: false,
      pinAddBtn: false,
    }
  }

  const scrollAreaWidth = containerWidth - IMAGE_ROW_GAP - ADD_BTN_WIDTH_COMPACT
  const needsScroll = imagesWidth > scrollAreaWidth
  return {
    addBtnWidth: ADD_BTN_WIDTH_COMPACT,
    isCompactAdd: true,
    needsScroll,
    pinAddBtn: true,
  }
}

/** 横向滚动到最右侧，让新加入的最后一张图完整露出 */
export function scrollTrackToRevealLastImage(
  trackEl: HTMLElement,
  options?: { smooth?: boolean },
) {
  const maxScroll = trackEl.scrollWidth - trackEl.clientWidth
  if (maxScroll <= 0) return

  trackEl.scrollTo({
    left: maxScroll,
    behavior: options?.smooth === false ? 'auto' : 'smooth',
  })
}

/**
 * 根据手指进入边缘区的深度计算滚动步长（0=刚进入边缘区，edgePx=贴边）
 * 使用二次曲线：刚靠近时很慢，越贴边越快
 */
export function computeDragTrackScrollStep(
  depthIntoEdgePx: number,
  edgePx: number,
  minStep = DRAG_TRACK_SCROLL_MIN_STEP_PX,
  maxStep = DRAG_TRACK_SCROLL_MAX_STEP_PX,
): number {
  if (depthIntoEdgePx <= 0 || edgePx <= 0) return 0
  const ratio = Math.min(depthIntoEdgePx / edgePx, 1)
  const eased = ratio * ratio
  return minStep + (maxStep - minStep) * eased
}

/** Sortable forceFallback 时挂在 body 上的拖拽镜像 */
export function getSortableDragElement(): HTMLElement | null {
  const el = document.querySelector<HTMLElement>(
    '.sortable-drag, .sortable-fallback',
  )
  return el ?? null
}

function rectsOverlapHorizontally(a: DOMRect, zoneLeft: number, zoneRight: number): boolean {
  return a.right > zoneLeft && a.left < zoneRight
}

function rectsOverlapVertically(a: DOMRect, b: DOMRect): boolean {
  return a.bottom > b.top && a.top < b.bottom
}

/**
 * 哨兵模式：仅当被拖拽图片与轨道左右缘哨兵区重叠时横向滚动；
 * 图片在中间区域或不在图片行纵向范围内时不滚动。
 */
export function autoScrollTrackByDraggedImage(
  track: HTMLElement,
  dragEl: HTMLElement,
  edgePx = DRAG_TRACK_SCROLL_EDGE_PX,
) {
  const maxScroll = track.scrollWidth - track.clientWidth
  if (maxScroll <= 0) return

  const trackRect = track.getBoundingClientRect()
  const dragRect = dragEl.getBoundingClientRect()

  if (!rectsOverlapVertically(dragRect, trackRect)) return

  const leftZoneRight = trackRect.left + edgePx
  const rightZoneLeft = trackRect.right - edgePx

  if (rectsOverlapHorizontally(dragRect, trackRect.left, leftZoneRight)) {
    const depth = Math.min(leftZoneRight - dragRect.left, edgePx)
    const step = computeDragTrackScrollStep(depth, edgePx)
    if (step > 0) {
      track.scrollLeft = Math.max(0, track.scrollLeft - step)
    }
    return
  }

  if (rectsOverlapHorizontally(dragRect, rightZoneLeft, trackRect.right)) {
    const depth = Math.min(dragRect.right - rightZoneLeft, edgePx)
    const step = computeDragTrackScrollStep(depth, edgePx)
    if (step > 0) {
      track.scrollLeft = Math.min(maxScroll, track.scrollLeft + step)
    }
  }
}

export function isTrackHorizontallyScrollable(track: HTMLElement | null | undefined): boolean {
  if (!track) return false
  return track.scrollWidth > track.clientWidth + 1
}

export function isPointInRect(x: number, y: number, rect: DOMRect | undefined): boolean {
  if (!rect) return false
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

/** 移除 Sortable forceFallback 残留节点，避免挡住后续点击（如加号） */
export function cleanupSortableDragArtifacts() {
  document.body.style.touchAction = ''
  document.body.classList.remove('tm-image-row--no-select')
  document.querySelectorAll('.sortable-fallback, .sortable-drag, .sortable-ghost').forEach((el) => {
    el.remove()
  })
}
