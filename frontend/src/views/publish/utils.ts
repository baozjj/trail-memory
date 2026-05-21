const IMAGE_ACCEPT = 'image/*'

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

/** 调起系统相册/文件选择，返回本地预览用 object URL */
export function pickImagesFromAlbum(): Promise<string[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = IMAGE_ACCEPT
    input.multiple = true
    input.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;'

    let settled = false

    const finish = (urls: string[]) => {
      if (settled) return
      settled = true
      input.remove()
      resolve(urls)
    }

    input.addEventListener('change', () => {
      const files = Array.from(input.files ?? []).filter((file) => file.type.startsWith('image/'))
      const urls = files.map((file) => URL.createObjectURL(file))
      finish(urls)
    })

    input.addEventListener('cancel', () => finish([]))

    const onWindowFocus = () => {
      window.setTimeout(() => {
        if (settled) return
        if (!input.files?.length) finish([])
      }, 400)
    }
    window.addEventListener('focus', onWindowFocus, { once: true })

    document.body.appendChild(input)
    input.click()
  })
}
