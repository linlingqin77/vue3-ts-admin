import { request } from "@/utils/service"
import * as User from "./types"

// 获取用户列表
export function getUserListApi(data: User.GetUserListRequestParams) {
  return request<User.GetUserListResponseData>({
    url: "/user/list",
    method: "post",
    data
  })
}

// 修改用户
export function updateUserApi(data: User.CreateOrUpdateUserRequestData) {
  return request<User.UpdateUserListResponseData>({
    url: "/user/update",
    method: "post",
    data
  })
}

// 删除用户

export function deleteUserApi(id: number) {
  return request({
    url: "/user/delete",
    method: "post",
    data: { id }
  })
}

// 新增用户

export function createUserApi(data: User.CreateOrUpdateUserRequestData) {
  return request({
    url: "/auth/register",
    method: "post",
    data
  })
}
