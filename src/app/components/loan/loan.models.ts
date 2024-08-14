export interface SimulateLoanModel {
  payment_number: number;
  amount: number;
  mode: string;
  interest_rate: string;
  period: number;
}

export interface PlanModel {
  id: number;
  crep_capital: string;
  crep_due_capital: string;
  crep_due_interest: string;
  crep_echeance_amount: number;
  crep_echeance_date: Date;
  crep_interest: string;
  crep_number: number;
  crep_status: {
    value: string;
    css: string;
    label: string;
  };
  currency: string;
  is_payable?: boolean;
}

export interface LoanPlanResponseModel {
  response_code: string;
  response_data: PlanModel[];
  response_message: string;
  success: boolean;
}

export interface SimulationResModel {
  amount: string;
  echeance_amount: number;
  exigible_amount: number;
  first_date: Date;
  interest_rate: string;
  payment_number: number;
  period: number;
  plan: PlanModel[];
  total_interests: string;
}

export interface ResponseDataModel {
  response_code: string;
  response_data: SimulationResModel | DefaultValuesLoan;
  response_message: string;
  success: boolean;
}

export interface ResModel {
  response_code: string;
  response_data: object;
  response_message: string;
  success: boolean;
}

export interface LoanTypeModel {
  active: boolean;
  bank_loan_mode: string;
  cap_imp_account_type: number;
  comment: string;
  financement_account_type: number;
  id: number;
  loan_type_code_reporting: string;
  title: string;
}

export interface CreditTypeModel {
  id: number;
  lookup_description: string | null;
  lookup_has_image_or_icon: boolean;
  lookup_icon: string | null;
  lookup_image: string | null;
  lookup_subtitle: string;
  lookup_title: string;
}

export interface AcccountWorkstationModel {
  id?: number;
  lookup_description?: string;
  lookup_has_image_or_icon?: boolean;
  lookup_icon?: string | null;
  lookup_image?: string;
  lookup_subtitle?: string;
  lookup_title?: string;
}

export interface BranchModel {
  chief: number;
  code: number;
  created_at: string;
  formatted_code: string;
  hr_chief: string | null;
  id: number;
  name: string;
  organization_tenant: number;
}

export interface CredBranchModel {
  additional_title: string | null;
  branch: BranchModel;
  client_category: number;
  id: number;
  loan_type: LoanTypeModel;
  periodicity: number;
}

export interface CredStatusModel {
  css: string;
  title: string;
  value: string;
  label: string;
}

export interface LoanListModel {
  cred_amount: string;
  cred_branch_defaults: CredBranchModel;
  cred_client_main_account: number;
  cred_code: string;
  cred_description: null;
  cred_difference: string;
  cred_echeance_amount: string;
  cred_expiry_date: string;
  cred_fees_paid: string;
  cred_financement_account: number;
  cred_first_date: string;
  cred_holder: string;
  cred_insurance_rate: string;
  cred_interest_rate: string;
  cred_manager: number;
  cred_mode: string;
  cred_payment_number: number;
  cred_period: number;
  cred_status: CredStatusModel;
  id: number;
}

export interface MainAccountModel {
  acc_account_type: string;
  acc_bank_id: number;
  acc_client: number;
  acc_client_type: string;
  acc_currency: string;
  acc_get_title: string;
  acc_holder: string;
  acc_number: string;
  acc_short_number: string;
}

export interface LoanPendingModel {
  amount: string;
  created_at: string;
  cred_defaults: CredBranchModel;
  fees_amount: string;
  fees_rate: string;
  first_date: string;
  id: string;
  interests_rate: string;
  main_account: MainAccountModel;
  payment_number: number;
  penalities_rate: string;
  period: number;
  status: CredStatusModel;
  success?: boolean;
  cred_holder?: string;
  cred_code?: string;
}

export interface LoanListResponseModel {
  response_code: string;
  response_data: LoanListModel[];
  response_message: string;
  success: boolean;
}

export interface BodyLoanModel {
  main_account?: number | string;
  amount?: number;
  payment_number?: string;
  period?: string;
  first_date?: string | Date;
  interests_rate?: string;
  penalities_rate?: string;
  fees_amount?: string;
  cred_defaults?: number;
}

export interface DefaultValuesLoan {
  branch: number;
  client_category: number;
  fees_account: number;
  fees_rate: string;
  fixed_amount_insurance: string;
  guarantee_rate: string | number;
  id: number;
  insurance_rate: string;
  max_amount: string;
  max_amount_fees: string;
  loan_type: LoanTypeModel;
  max_amount_guarantee: string;
  max_amount_insurance: string;
  max_interest_rate: string;
  max_month_duration: number;
  min_amount: string;
  min_amount_fees: string;
  min_amount_guarantee: string;
  min_amount_insurance: string;
  min_interest_rate: string;
  min_month_duration: number;
  penalities_account: number;
  penalities_rate: string;
  periodicity: number;
  profit_account: number;
  rattachement_cap_imp: number;
  rattachement_cap_imp_a_surveiller: number;
  rattachement_cap_imp_compromis: number;
  rattachement_cap_imp_cont: number;
  rattachement_cap_imp_doute: number;
  rattachement_cap_imp_pre_doute: number;
  rattachement_financement: number;
  rattachement_financement_a_surveiller: number;
  rattachement_financement_compromis: number;
  rattachement_financement_cont: number;
  rattachement_financement_doute: number;
  rattachement_financement_pre_doute: number;
}

export interface CredClientAccountModel {
  acc_available_balance: string;
  acc_bank_id: number;
  acc_credit_limit: string;
  acc_currency: string;
  acc_get_title: string;
  acc_holder: string;
  acc_number: string;
  acc_short_number: string;
  id: number;
}

export interface LoanModel {
  absolute_url: string;
  created_at: string;
  cred_amount: string;
  cred_branch_defaults: CredBranchModel;
  cred_capital_interests_total: string;
  cred_client: number;
  cred_client_code: string;
  cred_client_main_account: CredClientAccountModel;
  cred_code: string;
  cred_difference: string;
  cred_description: string | null;
  cred_echeance_amount: string;
  cred_expiry_date: string | Date;
  cred_fees_paid: string;
  cred_financement_account: CredClientAccountModel;
  cred_first_date: string | Date;
  cred_holder: string;
  cred_initiator: {
    id: number;
    name: string;
    picture: string;
    username: string;
  };
  cred_insurance_rate: string;
  cred_interest_rate: string;
  cred_manager: {
    id: number;
    name: string;
    picture: string;
    username: string;
  };
  cred_mode: string;
  cred_next_payment_date: string | Date;
  cred_paid_amount: string;
  cred_paid_capital: string;
  cred_payment_number: number;
  cred_penalities_rate: string;
  cred_period: number;
  cred_remaining_amount: string;
  cred_status: CredStatusModel;
  cred_total_interests: string;
  cred_unpaid_capital_account: CredClientAccountModel;
  delay_amount: number;
  delay_days: number;
  paid_amount: string;
  paid_interests: number;
  remaining_amount: string;
  remaining_interests: string;
  amount: string;
  cred_defaults: CredBranchModel;
  fees_amount: string;
  fees_rate: string;
  first_date: string;
  id: string;
  interests_rate: string;
  main_account: MainAccountModel;
  payment_number: number;
  penalities_rate: string;
  period: number;
  status: CredStatusModel;
  success?: boolean;
}

export interface PayLoanModel {
  loan_id: string;
  loan_plan_id: number;
  pin_code: string;
}
