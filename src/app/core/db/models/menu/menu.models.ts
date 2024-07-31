export interface MenuGroupModel {
  id: number;
  name: string;
  icon: string | null;
  required_operator_auth: true;
  menu_group_type: { title: string; value: string };
  active: boolean;
}
