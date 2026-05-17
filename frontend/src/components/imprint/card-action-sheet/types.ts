export type CardActionKey = 'copy' | 'exhibit' | 'edit' | 'delete'

export interface CardActionSheetProps {
  visible: boolean
}

export interface CardActionSheetEmits {
  'update:visible': [visible: boolean]
  action: [key: CardActionKey]
}
