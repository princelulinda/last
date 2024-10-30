import { ClientModel } from '../../../../core/db/models/auth';

export interface CreditLineResponseDataModel {
  response_data: object;
  success: boolean;
  response_message: string;
  response_code: string;
}
export interface CreditLineModel {
  id: number;
  crel_account_info: {
    id: number;
    acc_number: string;
    acc_short_number: string;
    acc_holder: string;
    acc_picture: string | null;
    acc_status: {
      status_code: string;
      reason: string;
      reason_explained: string;
      status_title: string;
      status_css: string;
      status_icon: string;
    };
    acc_account_type: string;
    acc_currency: string;
    acc_credit_limit: string;
    acc_available_balance: string;
  };
  crel_manager_info: {
    id: number;
    username: string;
    email: string;
    name: string;
    employee_client: ClientModel;
  };
  crel_code: string;
  crel_status: {
    value: string;
    css: string;
    title: string;
  };
  crel_authorized_by_info: {
    id: number;
    username: string;
    email: string;
    name: string;
    employee_client: ClientModel;
  };
  crel_cancelled_by_info: {
    id: number;
    username: string;
    email: string;
    name: string;
    employee_client: ClientModel;
  };
  created_at: Date;
  updated_at: Date;
  crel_credit_limit: string;
  crel_fees: number;
  crel_fees_rate: string;
  crel_expiry_date: Date;
  crel_authorized_at: Date;
  crel_cancelled_at: Date;
  crel_debitor_rate: string;
  crel_penalities_rate: string;
  crel_authorized_by: string;
  crel_cancelled_by: string;
}
