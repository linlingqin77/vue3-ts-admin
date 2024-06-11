import * as Position from "@/api/system/positions/types"
export type IdialogTitle = "编辑岗位" | "新增岗位"
export type IdialogType = "add" | "edit"
export type IdialogData = Position.IPosition

export interface IdialogProps {
  title: IdialogTitle
  type: IdialogType
  visible: boolean
  data: IdialogData
}
