export interface IMenus {
  id: number
  name: string
  order: number
  parent_id: number
  type: string
  icon: string
  component: string
  router_path: string
  router_params: string
  create_by: string
  permission: string
  is_frame: string
  is_cache: string
  visible: string
  status: string
  create_time?: string
  update_time?: string
  children?: IMenus[]
}

export interface CreateOrUpdateMenuRequestData extends Omit<IMenus, "id"> {
  id?: number
}

export type GetMenusResponseData = ApiResponseData<IMenus[]>
