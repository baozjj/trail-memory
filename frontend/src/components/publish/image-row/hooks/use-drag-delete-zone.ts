import { onUnmounted, ref } from 'vue'
import { DELETE_ZONE_HEIGHT } from '../const'
import { isPointInRect } from '../utils'

export function useDragDeleteZone() {
  const dragging = ref(false)
  const overDeleteZone = ref(false)
  const deleteZoneRef = ref<HTMLElement | null>(null)

  function updatePointer(clientX: number, clientY: number) {
    const deleteRect = deleteZoneRef.value?.getBoundingClientRect()
    overDeleteZone.value =
      isPointInRect(clientX, clientY, deleteRect) ||
      clientY >= window.innerHeight - DELETE_ZONE_HEIGHT
  }

  function onDragStart() {
    dragging.value = true
    overDeleteZone.value = false
  }

  function onDragMove(originalEvent: Event) {
    if (!dragging.value) return
    const point = getEventPoint(originalEvent)
    if (!point) return
    updatePointer(point.clientX, point.clientY)
  }

  function onDragEnd() {
    const shouldDelete = overDeleteZone.value
    dragging.value = false
    overDeleteZone.value = false
    return shouldDelete
  }

  return {
    dragging,
    overDeleteZone,
    deleteZoneRef,
    onDragStart,
    onDragMove,
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
