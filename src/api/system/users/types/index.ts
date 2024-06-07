export interface IUser {
  id: number
  sex: string
  phone: string
  email: string
  nickname: string
  username: string
  password: string
  // avatar: string
  remarks: string
  // website: string
  status: string
  // is_subscribe: string
  position_id: number
  department_id: number
  role_ids: number[]
}

export interface CreateOrUpdateUserRequestData extends Partial<IUser> {}

export type GetUserListResponseData = ApiResponseData<{
  list: IUser[]
  total: number
  page: number
}>
export type GetUserListRequestParams = {}
