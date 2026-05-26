function getTextareaMinHeight(textarea: HTMLTextAreaElement, minLines: number) {
  const style = getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(style.lineHeight)
  const resolvedLineHeight = Number.isFinite(lineHeight)
    ? lineHeight
    : Number.parseFloat(style.fontSize) * 1.35
  const paddingY =
    Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
  const borderY =
    Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth)
  return resolvedLineHeight * minLines + paddingY + borderY
}

/** 按内容撑开 textarea 高度；空内容时保持 minLines 行高 */
export function fitTextareaToContent(textarea: HTMLTextAreaElement | null, minLines = 1) {
  if (!textarea) return
  const minHeight = getTextareaMinHeight(textarea, minLines)
  if (!textarea.value) {
    textarea.style.height = `${minHeight}px`
    return
  }
  textarea.style.height = '0px'
  textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`
}

export function isBlobImageUrl(url: string): boolean {
  return url.startsWith('blob:')
}

export function revokeBlobImageUrl(url: string) {
  if (!isBlobImageUrl(url)) return
  URL.revokeObjectURL(url)
}

export function revokeBlobImageUrls(urls: string[]) {
  for (const url of urls) {
    revokeBlobImageUrl(url)
  }
}
