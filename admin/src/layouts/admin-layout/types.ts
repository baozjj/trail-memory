export interface AdminMenuItem {
  value: string
  label: string
  to?: { name: string }
  disabled?: boolean
}
