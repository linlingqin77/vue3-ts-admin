import * as Role from "@/api/system/roles/types"
export type IdialogTitle = "编辑角色" | "新增角色"
export type IdialogType = "add" | "edit"
export type IdialogData = Role.IRole

export interface IdialogProps {
  title: IdialogTitle
  type: IdialogType
  visible: boolean
  data: IdialogData
}
