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
// 添加角色
export const addRoleApi = (data: Role.IAddRoleApiRequestParams) => {
  return request<ApiResponseData<{}>>({
    url: "/system/role/add",
    method: "post",
    data
  })
}
// 批量删除角色
export const deleteRoleApi = (id: number | number[]) => {
  return request<ApiResponseData<{}>>({
    url: `/system/role/delete/${id}`,
    method: "get"
  })
}
// 修改角色
export const updateRoleApi = (data: Role.IUpdateRoleApiRequestParams) => {
  return request<ApiResponseData<{}>>({
    url: "/system/role/update",
    method: "post",
    data
  })
}

// 分配用户角色
export const assiginUserRoleApi = (data: Role.IAssignUserRolesApiRequestParams) => {
  return request<ApiResponseData<{}>>({
    url: "/system/role/assign",
    method: "post",
    data
  })
}
