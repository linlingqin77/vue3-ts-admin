export interface IMenus {
  id?: number
  name: string
  order: number
  parent_id: number
  type: number
  icon: string
  component: string
  router_path: string
  router_params: string
  create_by: string
  permission: string
  is_frame: number
  is_cache: number
  visible: number
  status: number
  create_time?: string
  update_time?: string
  children?: IMenus[]
}

export interface CreateOrUpdateMenuRequestData extends IMenus {}

export type GetMenusResponseData = ApiResponseData<CreateOrUpdateMenuRequestData[]>
