export interface ProfileHeaderProps {
  avatarDisplayUrl: string
  nickname: string
  signature: string
}

export interface ProfileHeaderEmits {
  'update:signature': [value: string]
  'edit-avatar': []
}
