export interface TypeMenuModel {
  id: number;
  name: string;
  icon: string;
  menu_active_icon: string;
  menu_disabled_icon: string;
  active: boolean;
}

export interface MenuGroupsModel {
  id: number;
  name: string;
  menu_group: {
    id: number;
    name: string;
    icon: string | null;
    required_operator_auth: boolean;
    menu_group_type: {
      title: string;
      value: string;
    };
    active: boolean;
  }[];
  active: true;
}
