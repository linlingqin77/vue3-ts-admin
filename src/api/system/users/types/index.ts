export interface IUser {
  id: number
  email: string
  nickname: string
  password: string
  avatar: string
  intro: string
  website: string
  isDisable: boolean
  is_subscribe: boolean
  position_id: number
  department_id: number
  roleIds: number[]
}

export interface CreateOrUpdateUserRequestData extends Partial<IUser> {}

export type GetUserListRequestData = ApiResponseData<{
  list: IUser[]
  total: number
  page: number
}>
