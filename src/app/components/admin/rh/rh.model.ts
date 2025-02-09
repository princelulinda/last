import { RoleModel } from '../role/role.models';

export interface AdminDepartementsDetailsModel {
  id: number;
  name: string;
  direction: number;
  roles: RoleModel[];
}
export interface AdminDirectionsDetailsModel {
  object: {
    id: number;
    name: string;
    direction_type: {
      title: string;
    };
    roles: RoleModel[];
  };
}
export interface AdminServicesDetailsModel {
  department: number;
  id: number;
  disallow_connexion: boolean;
  service_alpha_code: string;
  name: string;
  roles: RoleModel[];
}

export interface AdminCreateNewDepartmentModel {
  object: AdminCreateNewDepartmentModel;
}
export interface CreateNewDirectionModel {
  object: CreateNewDirectionModel;
  directionsData: string;
}
export interface CreateNewServiceModel {
  object: CreateNewServiceModel;
}

export interface AdminCreateNewDepartmentBodyModel {
  name: string | null | undefined;
  direction: number | null | undefined;
}
export interface CreateNewDirectionBodyModel {
  name: string | null | undefined;
  direction_type: string | null | undefined;
}
export interface CreateNewServiceBodyModel {
  name: string | null | undefined;
  department: number | null | undefined;
  disallow_connexion: boolean;
}
export interface DirectionType {
  id: string; // Example property
  name: string; // Example property
}

export interface CreateNewRoleModel {
  is_active: boolean;
  disable_during_leave: boolean;
  role_name: string;
  role_tye: string;
  menus: number[];
  role_group: string;
  content_type: string;
  object_id: number;
}
