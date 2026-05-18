import { ADD_BTN_WIDTH_COMPACT, ADD_BTN_WIDTH_FULL, IMAGE_CELL_SIZE, IMAGE_ROW_GAP } from './const'

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
