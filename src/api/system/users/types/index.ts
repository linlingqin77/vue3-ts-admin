import { IDepartment } from "../../departments/types"
import { IRole } from "../../roles/types"
import { IPosition } from "../../positions/types"
export interface IUser {
  id: number
  sex: string
  phone: string
  email: string
  nickname: string
  username: string
  password: string
  notes: string
  status: string
  department: IDepartment
  roles: IRole[]
  positions: IPosition[]
}

export interface CreateOrUpdateUserRequestParmas
  extends Omit<Partial<IUser>, "department" | "roles" | "positions" | "id"> {
  id?: number
  position_ids?: number[]
  department_id?: number
  role_ids?: number[]
}

export type GetUserListResponseData = ApiResponseData<{
  list: IUser[]
  total: number
  page: number
}>
export type GetUserListRequestParams = {}

export type UpdateUserListResponseData = ApiResponseData<{}>
