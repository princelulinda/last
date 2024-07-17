export interface ItemModel {
  id: number;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  lookup_icon: string | null;
  lookup_image: string;
  lookup_subtitle: string;
  lookup_title: string;
}

interface MenuModel {
  title: string;
  value: string;
}

export interface AdminModel {
  active: boolean;
  icon: string | null;
  id: number;
  menu_group_type: MenuModel;
  name: string;
  required_operator_auth: boolean;
}
