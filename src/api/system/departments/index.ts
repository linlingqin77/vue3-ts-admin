import { request } from "@/utils/service"
import * as Partment from "./types/index"
// 获取部门列表
export const getDepartmentDataApi = (params: Partment.GetDepartmentRequestParams) => {
  return request<Partment.GetDepartmentResponseData>({
    url: "/system/department/list",
    method: "get",
    params
  })
}
// 查询单个部门

export const getDepartmentByIdApi = (id: number) => {
  return request<Partment.GetDepartmentResponseData>({
    url: `/system/department/${id}`,
    method: "get"
  })
}

// 修改部门
export const updateDepartmentApi = (data: Partment.UpdateDepartmentRequestData) => {
  return request<Partment.GetDepartmentResponseData>({
    url: "/system/department/update",
    method: "post",
    data
  })
}

// 删除部门
export const deleteDepartmentApi = (id: number) => {
  return request<ApiResponseData<{}>>({
    url: `/system/department/delete/${id}`,
    method: "get"
  })
}

// 新增
export const addDepartmentApi = (data: Partment.CreateDepartmentRequestData) => {
  return request<ApiResponseData<{}>>({
    url: "/system/department/add",
    method: "post",
    data
  })
}
