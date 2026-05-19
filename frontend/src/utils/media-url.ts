/** 将后端媒体路径转为可加载的 URL（相对路径走 Vite 代理） */
export function resolveMediaUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('data:')) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return url
  return `/${url.replace(/^\//, '')}`
}

/** 批量解析媒体 URL */
export function resolveMediaUrls(urls: string[]): string[] {
  return urls.map(resolveMediaUrl).filter(Boolean)
}
