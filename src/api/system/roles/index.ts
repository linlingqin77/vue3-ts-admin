import { request } from "@/utils/service"
import * as Role from "./types/index"
// 获取角色列表
export const getRoleListApi = (params?: Role.IGetRoleListApiRequestParams) => {
  return request<Role.IGetRoleListApiResponseData>({
    url: "/system/role/list",
    method: "get",
    params
  })
}
