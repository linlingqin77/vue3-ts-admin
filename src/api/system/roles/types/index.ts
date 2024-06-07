export interface IRole {
  id: number
  name: string
  code: string
  order: number
  status: string
  create_time: string
  update_time: string
}
export type IGetRoleListApiRequestParams = {
  all?: number
  name?: string
  code?: string
  order?: number
  status?: string
  start_time?: string
  end_time?: string
  page?: number
  pageSize?: number
}
export type IGetRoleListApiResponseData = ApiResponseData<{
  list: IRole[]
  total: number
  page: number
  pageSize: number
}>
