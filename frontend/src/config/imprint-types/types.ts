/** 印记类型 id（动态配置，不再限制为固定 union） */
export type ImprintTypeId = string

export interface ImprintTypeDefinition {
  id: string
  /** 展示名称，如「西湖标毅线」 */
  label: string
  /** 列表封面图（public 目录下路径） */
  coverSrc: string
}
