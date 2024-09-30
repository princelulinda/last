export interface AccountsListModel {
  acc_branch: string;
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
  id: string;
  acc_credits_number: string | null;
  acc_debits_number: string | null;
  acc_last_eod_balance: string;
  min_signatories_number: string | null;
  no_trx_months: string | null;
  acc_m_cumul_credit: string;
  acc_y_cumul_credit: string;
  acc_client_id: string;
  acc_reserved_balance: string;
  acc_creditor_rate: string;
  acc_debitor_rate: string;
  acc_short_number: string;
  acc_number: string;
  acc_holder: string;
  acc_actual_balance: string;
  acc_get_title: string;
  acc_actual_interests: string;
  acc_available_balance: string;
  acc_credit_limit: string;
  acc_monthly_transactions_count: string;
  acc_calculated_monthly_fees: string;
  obj_created_by: string | null;
  created_at: string | null;
  acc_account_type: string;
  acc_branch: string | null;
  acc_last_y_balance: string | number;
  acc_last_m_balance: string;
  acc_daily_balance: string;
  acc_y_cumul_debit: string;
  acc_m_cumul_debit: string;

  account_manager: {
    name: string | null;
  };
  acc_status: {
    status_css: string;
    status_icon: string;
    status_title: string;
  };
  acc_branch_object: {
    name: string;
    id: string;
  };
  acc_currency: 'BIF';
}
