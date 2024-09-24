export interface TypeMenuModel {
  id: number;
  name: TypeMenuNamesModel;
  icon: string | null;
  image: {
    active: string;
    disabled: string;
  } | null;
  url: string;
  menu_active_icon: string;
  menu_disabled_icon: string;
  active: boolean;
  menuGroups: {
    id: number;
    name: string;
    menus: {
      id: number;
      name: string;
      component_url: string;
    }[];
  }[];
}
export type TypeMenuNamesModel =
  | 'Dashboard'
  | 'Banking'
  | 'Market'
  | 'Intranet'
  | 'Desk'
  | 'Reporting'
  | 'Admin';

export interface MenuGroupsModel {
  id: number;
  name: TypeMenuNamesModel;
  icon: string | null;
  required_operator_auth: boolean;
  menu_group_type: {
    title: TypeMenuNamesModel;
    value: string;
  };
  active: boolean;
}

export interface MenuGroupsByTypeMenuModel {
  id: number;
  name: TypeMenuNamesModel;
  menu_group: MenuGroupsModel[];
  active: true;
}

export interface MenuModel {
  id: number;
  name: string;
  icon: string | null;
  component_url: string;
  mobile_url: string | null;
  active: boolean;
  color: string;
  required_operator_auth: boolean;
  menu_group: number;
  menu_group_info: {
    id: number;
    name: string;
    icon: string | null;
    required_operator_auth: boolean;
    menu_group_type: { title: TypeMenuNamesModel; value: string };
    active: boolean;
  };
}
