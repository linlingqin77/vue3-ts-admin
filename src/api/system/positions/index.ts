import { request } from "@/utils/service"
import * as Position from "./types/index"
// 获取岗位列表
export const getPositionListApi = (params: Position.IGetPositionRequestParams) => {
  return request<Position.GetPositionResponseData>({
    url: "/system/position/list",
    method: "get",
    params
  })
}

// 修改岗位
export const updatePositionApi = (data: Position.UpdatePositionRequestData) => {
  return request<Position.UpdatePositionResponseData>({
    url: "/system/position/update",
    method: "post",
    data
  })
}

// 删除岗位
export const deletePositionApi = (id: number) => {
  return request({
    url: `/system/position/delete/${id}`,
    method: "get"
  })
}

// 添加岗位
export const addPositionApi = (data: Position.CreatePositionRequestParmas) => {
  return request({
    url: "/system/position/add",
    method: "post",
    data
  })
}
