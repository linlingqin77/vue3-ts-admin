export interface IRole {
  id: number
  name: string
  code: string
  order: number
  status: string
  notes: string
  menus_ids: number[]
  create_time?: string
  update_time?: string
}
export interface IGetRoleListApiRequestParams extends Partial<IRole> {
  // name?: string
  // code?: string
  // order?: number
  // status?: string
  all?: number
  start_time?: string
  end_time?: string
  page?: number
  pageSize?: number
}
export interface IAddRoleApiRequestParams extends IRole {}
export interface IUpdateRoleApiRequestParams extends IRole {}
export type IAssignUserRolesApiRequestParams = {
  user_ids: number[]
  role_id: number
}
export type IGetRoleListApiResponseData = ApiResponseData<{
  list: IRole[]
  total: number
  page: number
  pageSize: number
}>
