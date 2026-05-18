import { nextTick, onUnmounted, ref } from 'vue'
import { DELETE_ZONE_HEIGHT } from '../const'
import { isPointInRect } from '../utils'

export function useDragDeleteZone() {
  const dragging = ref(false)
  const overDeleteZone = ref(false)
  const deleteZoneRef = ref<HTMLElement | null>(null)

  let savedBodyOverflow = ''
  let savedHtmlOverflow = ''

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

  function lockPageScroll() {
    savedBodyOverflow = document.body.style.overflow
    savedHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }

  function unlockPageScroll() {
    document.body.style.overflow = savedBodyOverflow
    document.documentElement.style.overflow = savedHtmlOverflow
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
  }

  function onDragEnd(endEvent?: Event) {
    if (endEvent) syncFromEvent(endEvent)

    const shouldDelete = overDeleteZone.value
    detachDocumentListeners()
    unlockPageScroll()
    dragging.value = false
    overDeleteZone.value = false
    return shouldDelete
  }

  onUnmounted(() => {
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
