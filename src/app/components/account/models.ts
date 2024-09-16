export interface AccountsListModel {
  title: string;
  acc_holder: string;
  id: string;
  code: string;
  get_acc_number: string;
  acc_available_balance: number;
  acc_currency: 'BIF';
  acc_get_title: string;
  acc_number: number;
  acc_short_number: string;
  acc_bank_id: string;

  acc_status: {
    status_code: string;
  };
}
export interface AccountDetailModel {
  acc_short_number: string;
  acc_number?: string;
  acc_holder: string;
  acc_actual_balance: string;
  acc_get_title: string;
  acc_actual_interests: string;
  acc_available_balance: string;
  acc_credit_limit: string;
  acc_monthly_transactions_count: string;
  acc_calculated_monthly_fees: string;
  acc_status: {
    status_css: string;
    status_icon: string;
    status_title: string;
  };
  acc_currency: 'BIF';
}
