export interface IMenus {
  id?: number
  name: string
  order: number
  parent_id: number
  type: any
  icon: any
  component: string
  path: string
  create_by: any
  permission: any
  is_frame: string
  is_cache: string
  visible: string
  create_time: string
  update_time: string
  children?: IMenus[]
}

export interface CreateOrUpdateMenuRequestData extends IMenus {
  children?: CreateOrUpdateMenuRequestData[]
}

export type GetMenusResponseData = ApiResponseData<CreateOrUpdateMenuRequestData[]>
