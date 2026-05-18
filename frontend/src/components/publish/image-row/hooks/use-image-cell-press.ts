import { ref } from 'vue'

/** 按下未松手时的预备拖拽反馈（早于 Sortable chosen） */
export function useImageCellPress() {
  const pressingIndex = ref<number | null>(null)

  function onPressStart(index: number, event: PointerEvent) {
    if (event.button !== 0) return
    pressingIndex.value = index
  }

  function onPressEnd() {
    pressingIndex.value = null
  }

  return {
    pressingIndex,
    onPressStart,
    onPressEnd,
  }
}
