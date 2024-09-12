import { RoleTypeModel } from '../role/role.models';

export interface RoleListModel {
  access_type: RoleTypeModel;
  begins_at: string;
  ends_at: string;
  id: number;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  lookup_icon: string;
  lookup_image: string;
  lookup_subtitle: string;
  lookup_title: string;
  operator_role_state: {
    css: string;
    value: string;
  };
  role_group: {
    title: string;
    value: string;
  };
  role_id: number;
  role_name: string;
  role_type: {
    title: string;
    value: string;
  };
}

export interface RoleBodyModel {
  access_type: string;
  begins_at: string;
  ends_at: string;
  roles: {
    access_type: string;
    begins_at: string;
    ends_at: string;
    role: {
      id: number;
      lookup_description: string;
      lookup_has_image_or_icon: boolean;
      lookup_icon: string;
      lookup_image: string;
      lookup_subtitle: string;
      lookup_title: string;
    };
  }[];
}

export interface MenuGroupInfoModel {
  active: boolean;
  icon: string;
  id: number;
  name: string;
  required_operator_auth: boolean;
  menu_group_type: {
    title: string;
    value: string;
  };
}

export interface AllMenuListModel {
  id: number;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  lookup_icon: string;
  lookup_image: string;
  lookup_subtitle: string;
  lookup_title: string;
  menu_group_info?: MenuGroupInfoModel;
}

export interface OrganizationDetailsModel {
  id: number;
  is_active: boolean;
  is_teller: boolean;
  is_treasurer: boolean;
  organization: {
    id: number;
    accepts_login: boolean;
    company_type_code: string;
    company_type_name: string;
    institution_client: {
      client_full_name: string;
      client_code: string;
      id: number;
      picture: string;
      prefered_language: string;
      client_type: {
        css: string;
        title: string;
        value: string;
      };
    };
    is_active: boolean;
    is_erp: boolean;
    is_main: boolean;
    org_accounting_type: number;
  };
  operator: {
    allowed_ips: string[];
    id: number;
    is_active: string;
    fullname: string;
    username: string;
    employee_client: {
      client_full_name: string;
      client_code: string;
      client_id: number;
      client_email: string;
      has_pin: boolean;
      id: number;
      is_agent: boolean;
      is_merchant: boolean;
      is_partner_bank: boolean;
      picture: string;
      prefered_language: string;
      client_type: {
        css: string;
        title: string;
        value: string;
      };
    } | null;
  };
}

export interface PermissionModel {
  can_create_in_branch: boolean;
  can_delete_in_branch: boolean;
  can_edit_in_branch: boolean;
  can_see_in_branch: boolean;
  id: number;
  permissions_branches: {
    id: number;
    name: string;
  }[];
  permissions_counters: {
    id: number;
    name: string;
    branch: {
      id: number;
      name: string;
    };
  }[];
}

interface RoleMenuModel {
  id: number;
  active: boolean;
  component_url: string;
  icon: string;
  color: string;
  menu_group: number;
  name: string;
  mobile_url: string;
  required_operator_auth: boolean;
  menu_group_info: MenuGroupInfoModel | null;
}

export interface RoleMenuListModel {
  id: number;
  menu: RoleMenuModel;
  role: {
    id: number;
    role_name: string;
    role_type: {
      title: string;
      value: string;
      icon: string;
      css: string;
    };
    role_group: string;
    is_active: boolean;
    disable_during_leave: true;
    content_object: {
      id: number;
      value: string;
    };
  };
}

interface OrganizationTenantModel {
  accepts_login: boolean;
  bank_ihela_code: number;
  company_type_code: string;
  company_type_name: string;
  id: number;
  is_active: boolean;
  is_erp: boolean;
  is_main: boolean;
  org_accounting_type: number;
  institution_client: {
    client_full_name: string;
    client_code: string;
    id: number;
    picture: string;
    prefered_language: string;
    client_type: {
      css: string;
      title: string;
      value: string;
    };
  };
}

export interface AllBranchModel {
  chief: number;
  code: number;
  created_at: Date;
  formatted_code: string;
  hr_chief: number;
  id: number;
  name: string;
  organization_tenant: OrganizationTenantModel;
}
