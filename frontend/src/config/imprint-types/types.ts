/** 印记类型 id（与后端 typeId、静态资源文件名解耦，便于扩展） */
export type ImprintTypeId = 'xihu-biaoyi' | 'wugongshan'

export interface ImprintTypeDefinition {
  id: ImprintTypeId
  /** 展示名称，如「西湖标毅线」 */
  label: string
  /** 列表封面图（public 目录下路径） */
  coverSrc: string
}
