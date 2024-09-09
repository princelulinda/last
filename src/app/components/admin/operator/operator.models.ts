interface MenuTypeModel {
  title: string;
  value: string;
}

interface MenuGroupModel {
  id: number;
  name: string;
  active: boolean;
  required_operator_auth: boolean;
  menu_group_type: MenuTypeModel;
}

export interface AdminMenuModel {
  active: boolean;
  color?: string;
  component_url: string;
  icon: string;
  id?: number;
  menu_group: number;
  name: string;
  mobile_url: string;
  required_operator_auth?: boolean;
  menu_group_info?: MenuGroupModel;
  success?: boolean;
  response_message?: string;
}

interface ContentModel {
  id: number;
  value: string;
}

interface RoleTypeModel {
  css: string;
  title: string;
  value: string;
  icon: string;
}

export interface RoleModel {
  id: number;
  is_active: boolean;
  role_group: string;
  role_name: string;
  role_type: RoleTypeModel;
  content_object: ContentModel;
}

export interface RoleMenuModel {
  id: number;
  menu: AdminMenuModel;
  role: RoleModel;
}
