import * as Department from "@/api/system/departments/types"
export type IdialogTitle = "编辑部门" | "新增部门"
export type IdialogType = "add" | "edit"
export type IdialogData = Department.IDepartment

export interface IdialogProps {
  title: IdialogTitle
  type: IdialogType
  visible: boolean
  data: IdialogData
}
