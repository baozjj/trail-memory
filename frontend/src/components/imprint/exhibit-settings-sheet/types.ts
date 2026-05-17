import type { ImprintListItem } from '@/types/imprint'

export interface ExhibitSettingsSheetProps {
  visible: boolean
  item: ImprintListItem | null
}

export interface ExhibitSettingsPayload {
  isPublic: boolean
  linkSuffix: string
}

export interface ExhibitSettingsSheetEmits {
  'update:visible': [visible: boolean]
  save: [payload: ExhibitSettingsPayload]
}
