export interface IPosition {
  id: number
  name: string
  order: string
  code: string
  status: string
  remark: string
}
// 查询
export type GetPositionRequestParams = {
  page: number
  pageSize: number
  name: string
  status: string
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
