import { SHARE_DOMAIN } from '@/mock/domain'
import type { ImprintListItem } from '@/types/imprint'

export function buildImprintShareLink(
  item: Pick<ImprintListItem, 'id' | 'linkSuffix'>,
): string {
  return `https://${SHARE_DOMAIN}/m/${item.id}-${item.linkSuffix}`
}

export function imprintLinkPrefix(id: string): string {
  return `/m/${id}-`
}

const SUFFIX_PATTERN = /^[a-zA-Z0-9]*$/

export function sanitizeLinkSuffix(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '')
}

export function isValidLinkSuffix(value: string): boolean {
  return SUFFIX_PATTERN.test(value)
}
