import { request } from "@/utils/service"
import * as Menus from "./types"
// 获取菜单树
interface GetMenusTreeRequestData {
  name?: string
  status?: string
  all?: number
}
export function getMenusTreeApi(params?: GetMenusTreeRequestData) {
  return request<Menus.GetMenusResponseData>({
    url: "/system/menu/tree",
    method: "get",
    params
  })
}

// 新增菜单
export function createMenuApi(data: Menus.CreateOrUpdateMenuRequestData) {
  return request<ApiResponseData<{}>>({
    url: "/system/menu/add",
    method: "post",
    data
  })
}

// 删除菜单

export function deleteMenuApi(id: number) {
  return request<ApiResponseData<{}>>({
    url: "/system/menu/delete",
    method: "post",
    params: { id }
  })
}
// 编辑菜单

export function updateMenuApi(data: Menus.CreateOrUpdateMenuRequestData) {
  return request<ApiResponseData<{}>>({
    url: "/system/menu/update",
    method: "post",
    data
  })
}
