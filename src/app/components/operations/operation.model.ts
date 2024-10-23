import {
  AutocompleteModel,
  CurrencyModel,
} from '../../global/models/global.models';
import { OrganizationModel } from '../auth/auth.model';

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

export interface CounterListModel {
  code: number;
  created_at: string;
  formatted_code: string;
  id: number;
  name: string;
  branch: {
    chief: number;
    code: number;
    created_at: string;
    formatted_code: string;
    hr_chief: string;
    id: number;
    name: string;
    organization_tenant: {
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
        client_code: string;
        client_full_name: string;
        id: number;
        client_type: {
          title: string;
          value: string;
          css: string;
        };
        picture: string;
        prefered_language: string;
      };
    };
  };
}

export interface CounterDetailsModel {
  code: number;
  created_at: string;
  formatted_code: string;
  id: number;
  name: string;
  branch: {
    chief: number;
    code: number;
    created_at: string;
    formatted_code: string;
    hr_chief: string;
    id: number;
    name: string;
    organization_tenant: {
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
        client_code: string;
        client_full_name: string;
        id: number;
        client_type: {
          title: string;
          value: string;
          css: string;
        };
        picture: string;
        prefered_language: string;
      };
    };
  };
}

export interface AuxBoxModel {
  absolute_url: string;
  acc_number: string;
  acc_short_number: string;
  balance: string;
  currency: CurrencyModel;
  id: number;
  ledger_status: string;
  ledger_title: string;
  category: {
    code: number;
    description: string;
    id: number;
    ledger_full_id: string;
  };
}

export interface HrModel {
  id: number;
  is_teller: boolean;
  is_treasurer: boolean;
  operator: {
    email: string;
    id: number;
    name: string;
    username: string;
    employee_client: {
      client_id: number;
      client_code: string;
      client_state: string;
      client_full_name: string;
      id: number;
      picture: string;
      prefered_language: string;
      client_type: {
        css: string;
        title: string;
        value: string;
      };
      has_pin: boolean;
      is_agent: boolean;
      is_merchant: boolean;
      is_partner_bank: boolean;
    };
  };
  organization: OrganizationModel;
}

export interface CounterTellerModel {
  auxiliary_box: AuxBoxModel;
  balance: string;
  connected: boolean;
  counter: CounterDetailsModel;
  currency: CurrencyModel;
  hr_operator: HrModel;
  hr_treasurer: HrModel;
  id: number;
}

export interface CounterTreasurerModel {
  id: string;
  is_teller: boolean;
  is_treasurer: boolean;
  operator: {
    email: string;
    id: number;
    name: string;
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
    };
  };
}

interface AccountMappingModel {
  account: AuxBoxModel;
  account_type: {
    css: string;
    icon: string;
    title: string;
    value: string;
  };
  created_at: string;
  id: number;
  institution: string;
  is_active: boolean;
  name: string;
}

export interface MainBoxModel {
  account: number;
  account_mapping: AccountMappingModel;
  counter: number;
  currency: CurrencyModel;
  id: number;
  title: string;
}

export interface AssignOperatorBodyModel {
  counter_pk: number;
  operator_code: string;
  pin_code: string;
  treasurer?: number;
}

export interface AssignOperatorModel {
  response_code: string;
  response_message: string;
  success: boolean;
}

export interface TreasurerAutocompleteModel extends AutocompleteModel {
  username?: string;
  is_teller?: boolean;
  is_treasurer?: boolean;
}
