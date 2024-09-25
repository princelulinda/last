export interface OperationListModel {
  amount: number;
  code: string;
  created_at: string;
  id: number;
  created_by: {
    id: number;
    name: string;
    username: string;
  };
  description_credit: string;
  description_debit: string;
  reference: string;
  status: {
    value: string;
    title: string;
    css: string;
  };
  operation_type: {
    code: string;
    id: number;
    description: string;
  };
  other_info: {
    amount: UsedModel;
    cios_amount: UsedModel;
    ihela_cios_amount: UsedModel;
    transfer_type?: UsedModel;
    deposit_type?: UsedModel;
    withdrawal_type?: UsedModel;
    cios_debit_account_type?: UsedModel;
    transfer_sub_type?: UsedModel;
    account_holder?: UsedModel;
    account?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    client_account?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    loan?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    access_bank?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    debit_bank?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    credit_bank?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    agent?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    debit_account_holder?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    debit_account?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    access_client?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    connected_client?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    credit_account_holder?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    credit_account?: {
      type: string;
      label: string;
      data: {
        detail?: string;
        data?: {
          detail: string;
        };
      };
    };
    info_required_fields: string[];
    info_type: string;
    merchant: {
      data: {
        id: number;
        merchant_title: string;
        code: string;
        detail: string;
        data?: {
          detail: string;
        };
      };
      label: string;
      type: string;
    };
    merchant_payment: {
      data: {
        code: string;
        detail: string;
        id: number;
        is_cart: boolean;
        data?: {
          detail: string;
        };
      };
      label: string;
      type: string;
    };
    merchant_reference: UsedModel;
    agent_commission_amount?: UsedModel;
    client_recruiter_cios_amount?: UsedModel;
    total_commission_amount?: UsedModel;
    description?: UsedModel;
    transaction_by: UsedModel;
  };
  client_account: {
    account_number: string;
    account_holder: string;
    id: number;
  };
  external_reference: string;
  extourne_reference: string;
  pending_reference?: string;
  approved_by?: string;
  approved_at?: string;
}

interface UsedModel {
  data: string;
  label: string;
  type: string;
}

export interface OperationTransactionModel {
  account: {
    account_number: string;
    account_title: string;
  };
  amount: string;
  can_show_amount: boolean;
  credit: string;
  date_created: string;
  debit: string;
  description: string;
  exturn_data: {
    is_original: boolean;
  };
  is_ledger: boolean;
  operation: string;
  reference: string;
  solde: string;
}
