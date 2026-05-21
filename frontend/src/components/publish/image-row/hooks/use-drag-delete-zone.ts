import { nextTick, onUnmounted, ref, type Ref } from 'vue'
import { DELETE_ZONE_HEIGHT } from '../const'
import {
  autoScrollTrackByDraggedImage,
  getSortableDragElement,
  isPointInRect,
  isTrackHorizontallyScrollable,
} from '../utils'

export interface UseDragDeleteZoneOptions {
  trackRef?: Ref<HTMLElement | null>
}

export function useDragDeleteZone(options: UseDragDeleteZoneOptions = {}) {
  const dragging = ref(false)
  const overDeleteZone = ref(false)
  const deleteZoneRef = ref<HTMLElement | null>(null)

  let savedBodyOverflowY = ''
  let savedHtmlOverflowY = ''
  let trackScrollRafId = 0

  function tickTrackScroll() {
    if (!dragging.value) return

    const track = options.trackRef?.value
    if (track && isTrackHorizontallyScrollable(track)) {
      const dragEl = getSortableDragElement()
      if (dragEl) {
        autoScrollTrackByDraggedImage(track, dragEl)
      }
    }

    trackScrollRafId = requestAnimationFrame(tickTrackScroll)
  }

  function startTrackScrollLoop() {
    cancelAnimationFrame(trackScrollRafId)
    trackScrollRafId = requestAnimationFrame(tickTrackScroll)
  }

  function stopTrackScrollLoop() {
    cancelAnimationFrame(trackScrollRafId)
    trackScrollRafId = 0
  }

  function getDeleteZoneRect(): DOMRect {
    const el = deleteZoneRef.value
    if (el) return el.getBoundingClientRect()

    const height = DELETE_ZONE_HEIGHT
    return new DOMRect(0, window.innerHeight - height, window.innerWidth, height)
  }

  function updatePointer(clientX: number, clientY: number) {
    overDeleteZone.value = isPointInRect(clientX, clientY, getDeleteZoneRect())
  }

  function syncFromEvent(event: Event) {
    const point = getEventPoint(event)
    if (!point) return
    updatePointer(point.clientX, point.clientY)
  }

  /** 仅锁纵向，保留图片轨道横向滚动 */
  function lockPageScroll() {
    savedBodyOverflowY = document.body.style.overflowY
    savedHtmlOverflowY = document.documentElement.style.overflowY
    document.body.style.overflowY = 'hidden'
    document.documentElement.style.overflowY = 'hidden'
  }

  function unlockPageScroll() {
    document.body.style.overflowY = savedBodyOverflowY
    document.documentElement.style.overflowY = savedHtmlOverflowY
  }

  function onDocumentMove(event: Event) {
    if (!dragging.value) return
    syncFromEvent(event)

    if (overDeleteZone.value && event.cancelable) {
      event.preventDefault()
    }
  }

  function attachDocumentListeners() {
    document.addEventListener('touchmove', onDocumentMove, { passive: false })
    document.addEventListener('mousemove', onDocumentMove)
  }

  function detachDocumentListeners() {
    document.removeEventListener('touchmove', onDocumentMove)
    document.removeEventListener('mousemove', onDocumentMove)
  }

  async function onDragStart() {
    dragging.value = true
    overDeleteZone.value = false
    lockPageScroll()
    await nextTick()
    attachDocumentListeners()
    startTrackScrollLoop()
  }

  function onDragEnd(endEvent?: Event) {
    if (endEvent) syncFromEvent(endEvent)

    const shouldDelete = overDeleteZone.value
    stopTrackScrollLoop()
    detachDocumentListeners()
    unlockPageScroll()
    dragging.value = false
    overDeleteZone.value = false
    return shouldDelete
  }

  onUnmounted(() => {
    stopTrackScrollLoop()
    detachDocumentListeners()
    unlockPageScroll()
  })

  return {
    dragging,
    overDeleteZone,
    deleteZoneRef,
    onDragStart,
    onDragEnd,
  }
}

function getEventPoint(event: Event): { clientX: number; clientY: number } | null {
  if (event instanceof TouchEvent) {
    const touch = event.touches[0] ?? event.changedTouches[0]
    if (!touch) return null
    return { clientX: touch.clientX, clientY: touch.clientY }
  }
  if (event instanceof MouseEvent) {
    return { clientX: event.clientX, clientY: event.clientY }
  }
  return null
}
