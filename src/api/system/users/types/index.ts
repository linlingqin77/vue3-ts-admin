export interface IUser {
  id: number
  phone: string
  email: string
  nickname: string
  password: string
  avatar: string
  intro: string
  website: string
  is_disable: string
  is_subscribe: string
  position_id: number
  department_id: number
  roleIds: number[]
}

export interface CreateOrUpdateUserRequestData extends Partial<IUser> {}

export type GetUserListResponseData = ApiResponseData<{
  list: IUser[]
  total: number
  page: number
}>
export type GetUserListRequestParams = {}
