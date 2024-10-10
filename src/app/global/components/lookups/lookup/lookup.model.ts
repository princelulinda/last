// interface MenuModel {
//   title: string;
//   value: string;
// }

// export interface AdminModel {
//   active: boolean;
//   icon: string | null;
//   id: number;
//   menu_group_type: MenuModel;
//   name: string;
//   required_operator_auth: boolean;
// }

export interface ClientInfoModel {
  acc_holder: string;
  acc_number: string;
  acc_picture: string;
  acc_account_type: string;
  acc_client_id: string;
  acc_client_type: string;
  acc_status: {
    status_css: string;
    status_icon: string;
    reason: string;
    reason_explained: string;
  };
  organization: {
    id: string;
  };
}

export interface SignatureModel {
  object: {
    signature: string;
    signature2: string;
  };
}
