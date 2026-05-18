const IMAGE_ACCEPT = 'image/*'

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
    input.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;'

    let settled = false

    const finish = (urls: string[]) => {
      if (settled) return
      settled = true
      input.remove()
      resolve(urls)
    }

    input.addEventListener('change', () => {
      const files = Array.from(input.files ?? []).filter((file) =>
        file.type.startsWith('image/'),
      )
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
