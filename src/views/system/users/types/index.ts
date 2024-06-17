import * as User from "@/api/system/users/types"
export type IdialogTitle = "编辑用户" | "新增用户"
export type IdialogType = "add" | "edit"
export type IdialogData = User.CreateOrUpdateUserRequestParmas
