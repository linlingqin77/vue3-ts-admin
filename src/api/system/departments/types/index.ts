export interface IDepartment {
  id: number
  parent_id: number
  name: string
  order: number
  leader: string
  phone: string
  email: string
  status: string
  create_time?: string
  update_time?: string
}
export interface DepartmentResponseData extends IDepartment {
  children: IDepartment[]
}
export type GetDepartmentRequestParams = {
  page?: number
  pageSize?: number
  name?: string
  status?: string
  all?: number
}
export type GetDepartmentResponseData = ApiResponseData<{
  list: DepartmentResponseData[]
  total: number
  page: number
  pageSize: number
}>

export type CreateDepartmentRequestData = Omit<IDepartment, "id" | "children" | "create_time" | "update_time">
export type UpdateDepartmentRequestData = Omit<IDepartment, "children" | "create_time" | "update_time">
