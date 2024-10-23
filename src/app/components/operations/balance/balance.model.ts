export interface BalanceActionModel {
  success: boolean;
  response_message: string;
  response_code: string;
  response_data: string;
}

export interface BalanceModel {
  id: number;
  created_at: Date;
  institution: {
    id: number;
    created_at: Date;
    name: string;
    institution: string;
    in_institution_account: string;
    is_active: boolean;
    account: {
      id: number;
      acc_number: string;
      ledger_title: string;
    };
    account_type: {
      title: string;
      value: string;
      css: string;
      icon: string;
    };
  };
  hr_noted_by: {
    id: number;
    operator: OperatorModel;
    is_teller: boolean;
    is_treasurer: boolean;
  };
  ext_balance: string;
  cbs_balance: string;
  hr_verified_by: {
    operator: OperatorModel;
  };
  verified_at: Date;
  hr_suspected_by: {
    operator: OperatorModel;
  };
  suspected_at: Date;
  reason: string;
  balance_difference: number | string;
}

export interface OperatorModel {
  id: number;
  username: string;
  name: string;
  picture: string;
}
