export interface TypeMenuModel {
  id: number;
  name: string;
  icon: string | null;
  image: {
    active: string;
    disabled: string;
  } | null;
  url: string;
  menu_active_icon: string;
  menu_disabled_icon: string;
  active: boolean;
}
export type TypeMenuNamesModel =
  | 'Dashboard'
  | 'Banking'
  | 'Market'
  | 'Intranet'
  | 'Desk'
  | 'Reporting'
  | 'Admin';

export interface GroupMenuModel {
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

export interface MenuGroupsModel {
  id: number;
  name: TypeMenuNamesModel;
  menu_group: GroupMenuModel[];
  active: true;
}
