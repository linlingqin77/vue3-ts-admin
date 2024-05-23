import { request } from "@/utils/service"
import * as Menus from "./types"
// 获取菜单树
export function getMenusTreeApi() {
  return request<Menus.GetMenusResponseData>({
    url: "/system/menu/tree",
    method: "get"
  })
}

// 新增菜单
export function createMenuApi(data: Menus.CreateOrUpdateMenuRequestData) {
  return request({
    url: "/system/menu/add",
    method: "post",
    data
  })
}
