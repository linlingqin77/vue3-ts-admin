import * as Menus from "@/api/system/menus/types"

export type IdialogTitle = "编辑菜单" | "新增菜单"
export type IdialogType = "add" | "edit"
export type IdialogData = Menus.CreateOrUpdateMenuRequestData

export interface IdialogProps {
  title: IdialogTitle
  type: IdialogType
  visible: boolean
  data: IdialogData
}
