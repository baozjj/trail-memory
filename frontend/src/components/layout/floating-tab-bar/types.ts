export type TabKey = 'grid' | 'user'

export interface FloatingTabBarProps {
  active?: TabKey
}

export interface FloatingTabBarEmits {
  change: [tab: TabKey]
}
