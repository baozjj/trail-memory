import { resolveMediaUrl } from '@/utils/media-url'

/** 无自定义头像时的默认图 */
export const DEFAULT_AVATAR_URL = '/images/default-avatar.svg'

/** 解析展示用头像地址，无图时返回默认头像 */
export function resolveAvatarUrl(avatarUrl?: string | null): string {
  const trimmed = avatarUrl?.trim()
  if (!trimmed) return DEFAULT_AVATAR_URL
  return resolveMediaUrl(trimmed)
}
