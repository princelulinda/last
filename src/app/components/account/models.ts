export interface accountsList {
  title: string;
  acc_holder: string;
  id: string;
  code: string;
  acc_available_balance: number;
  acc_currency: 'BIF';
  acc_account_type: string;
  acc_number: number;
  acc_short_number: string;

  acc_status: {
    status_code: string;
  };
}
