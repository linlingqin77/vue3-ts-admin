export interface IPosition {
  id: number
  name: string
  order: string
  code: string
  status: string
  remark: string
  create_time: string
  update_time: string
}
// 查询
export type IGetPositionRequestParams = {
  page?: number
  pageSize?: number
  name?: string
  status?: string
  code?: string
  all?: number
}
export type GetPositionResponseData = ApiResponseData<{
  list: IPosition[]
  total: number
  page: number
  pageSize: number
}>
// 新增
export type CreatePositionRequestData = Omit<IPosition, "id">
export type CreatePositionResponseData = ApiResponseData<IPosition>
// 更新
export type UpdatePositionRequestData = IPosition
export type UpdatePositionResponseData = ApiResponseData<IPosition>
