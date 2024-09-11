import { AdminMenuModel } from '../menu/menu.models';

interface ContentModel {
  id: number;
  value: string;
}

export interface RoleTypeModel {
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
