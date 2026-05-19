const IMAGE_ACCEPT = 'image/*'

/** 调起相册选择单张图片 */
export function pickSingleImageFromAlbum(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = IMAGE_ACCEPT
    input.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;'

    let settled = false

    const finish = (file: File | null) => {
      if (settled) return
      settled = true
      input.remove()
      resolve(file)
    }

    input.addEventListener('change', () => {
      const file = Array.from(input.files ?? []).find((f) => f.type.startsWith('image/'))
      finish(file ?? null)
    })

    input.addEventListener('cancel', () => finish(null))

    const onWindowFocus = () => {
      window.setTimeout(() => {
        if (settled) return
        if (!input.files?.length) finish(null)
      }, 400)
    }
    window.addEventListener('focus', onWindowFocus, { once: true })

    document.body.appendChild(input)
    input.click()
  })
}
