import { SHARE_DOMAIN } from '@/mock/domain'
import type { ImprintListItem } from '@/types/imprint'

/** Hash 路由下分享路径（复制/NFC 写入必须带 `#`） */
export const IMPRINT_SHARE_ROUTE_PREFIX = '/#/m/'

/** 解析分享路径 /m/{id}-{linkSuffix}（slug 不含 # 前缀） */
export function parseShareSlug(slug: string): { id: string; linkSuffix: string } | null {
  const trimmed = slug.trim()
  if (!trimmed) return null

  const dashIndex = trimmed.lastIndexOf('-')
  if (dashIndex <= 0) return null

  const id = trimmed.slice(0, dashIndex)
  const linkSuffix = trimmed.slice(dashIndex + 1)
  if (!id || !isValidLinkSuffix(linkSuffix)) return null

  return { id, linkSuffix }
}

/** 构建分享链接（浏览器内优先使用当前域名，便于本地/NFC 调试） */
export function buildImprintShareLink(
  item: Pick<ImprintListItem, 'id' | 'linkSuffix'>,
): string {
  const host =
    typeof window !== 'undefined' && window.location.host
      ? window.location.host
      : SHARE_DOMAIN
  const protocol =
    typeof window !== 'undefined' && window.location.protocol
      ? window.location.protocol
      : 'https:'
  return `${protocol}//${host}${IMPRINT_SHARE_ROUTE_PREFIX}${item.id}-${item.linkSuffix}`
}

export function imprintLinkPrefix(id: string): string {
  return `${IMPRINT_SHARE_ROUTE_PREFIX}${id}-`
}

const SUFFIX_PATTERN = /^[a-zA-Z0-9]*$/

export function sanitizeLinkSuffix(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '')
}

export function isValidLinkSuffix(value: string): boolean {
  return SUFFIX_PATTERN.test(value)
}
