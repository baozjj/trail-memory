export type TabKey = 'grid' | 'user'

export interface FloatingTabBarProps {
  activeTab?: TabKey
}

export interface FloatingTabBarEmits {
  change: [tab: TabKey]
}
