export interface ProfileHeaderProps {
  avatarUrl: string
  nickname: string
  signature: string
}

export interface ProfileHeaderEmits {
  'update:signature': [value: string]
}
