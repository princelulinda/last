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
  fragment?: string;
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
export interface PageMenusModel {
  icon: string;
  title: string;
  url: string;
  fragment?: string;
  icon_classes?: string;
}

export interface AdminMenuBodyModel {
  active: boolean;
  color: string;
  component_url: string;
  fragment?: string;
  icon: string;
  menu_group: number;
  mobile_url: string;
  name: string;
}
