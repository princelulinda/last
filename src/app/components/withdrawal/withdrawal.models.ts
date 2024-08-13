export interface WithdrawalModel {
  agent_code: string;
  amount: number;
  debit_account: string;
  debit_bank: number;
  debit_type: string;
  description: string;
  pin_code: string;
  withdrawal_type: string;
}
