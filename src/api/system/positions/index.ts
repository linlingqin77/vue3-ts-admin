import { request } from "@/utils/service"
import * as Partment from "./types/index"
// 获取岗位列表
export const getPositionDataApi = (params: Partment.GetPositionRequestParams) => {
  return request<Partment.GetPositionResponseData>({
    url: "/system/position/list",
    method: "get",
    params
  })
}
// 查询单个岗位

export const getPositionByIdApi = (id: number) => {
  return request<Partment.GetPositionResponseData>({
    url: `/system/position/${id}`,
    method: "get"
  })
}

// 修改岗位
export const updatePositionApi = (data: Partment.UpdatePositionRequestData) => {
  return request<Partment.UpdatePositionResponseData>({
    url: "/system/position/update",
    method: "post",
    data
  })
}

// 删除岗位
export const deletePositionApi = (id: number) => {
  return request({
    url: `/system/position/delete${id}`,
    method: "get"
  })
}
