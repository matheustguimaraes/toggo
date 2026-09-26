export interface ISessionUser {
  data: IData
  status: string
}

export interface IData {
  user: IUser
  expires: string
  accessToken: string
}

export interface IUser {
  name: string
  email: string
  id: number
  password: string
  last_login: string
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  groups: any[]
  user_permissions: any[]
}
