import { AutocompleteModel } from '../../global/models/global.models';
import { SectorActivityModel } from '../merchant/merchant.models';

export interface ClientWorkstationModel {
  id: number | string;
  client_id: number | string;
  client_code: string;
  client_type: string;
  client_full_name: string | null;
  client_email: string;
  client_phone_number: string;
  client_is_secret: boolean;
  client_detail: IndividualClientModel;
  client_classification: {
    title: string;
    value: string;
    css: string;
  };
  absolute_url: string;
  create_account_url: string;
  picture_url: string;
  client_category: {
    id: string;
    title: string;
    text: string;
    comment: string;
    absolute_url: string;
  };
  client_category_type: ClientCategoryTypeModel;
  activity_sector: SectorActivityModel;
  client_last_activity: string;
  client_category_title: string;
  client_category_id: number;
  client_category_type_title: string;
  client_category_type_id: number;
  client_is_custom: boolean;
  created_at: Date;
}

export interface ClientCorporateModel {
  id: number;
  ident: number | string;
  corp_name: string;
  corp_abrv_name: string;
  activity_sector: string;
  corp_head_quarters: string;
  fisc: FiscModel[];
  logo: string;
  corp_group_name: string;
  corp_social_capital_amount: string;
  corp_turnover_amount: string;
  is_suspect: boolean;
  addresses: AdresseClientModel[];
  corp_risk_degree: {
    value: string;
    title: string;
  };
  in_suspected_country: boolean;
  live_in_non_cooperative_country: boolean;
  not_on_black_list: boolean;
}

export interface FiscModel {
  id: number;
  trade_register_number: string;
  trn_file: string;
  trn_issue_date: string;
  tax_identification_code: string;
  tic_file: string;
  tic_issue_date: string;
  postal_code: string;
  is_value_added_tax_payer: boolean;
  is_consumption_tax_payer: boolean;
  is_tl_tax_payer: boolean;
  legal_form: string;
  fiscal_center_code: string;
}

export interface LanguageWorkstationModel {
  success: boolean;
  response_code: string;
  response_data: {
    code: string;
    title: string;
  };
  response_message: string;
}

export interface ClientLanguageWorkstationModel {
  success: boolean;
  response_message: string;
  response_data: {
    language: string;
  };
  response_code: string;
}

export interface IndividualClientModel {
  id: number;
  ident: number | string;
  firstname: string;
  email: string;
  lastname: string;
  middle_name: string;
  picture: string;
  sex: string;
  birthday: string;
  other_profession: string;
  profession: string[];
  birth_place: {
    id: number;
    name: string;
    slug: string;
  };
  addresses: AdresseClientModel[];
  father_name: string;
  mother_name: string;
  marital_status: string;
  matrimonial_status: string;
  spouse_name: string;
  spouse_telephone: string;
  telephones: string;
  card_id: {
    id: number;
    created_at: Date;
    updated_at: Date;
    card_id_type: string;
    other_card_type: string;
    reference_number: string;
    place_of_issue: string;
    date_of_issue: Date;
    expiry_date: Date;
    card_id_picture_recto: string;
    card_id_picture_verso: string;
    profile: number;
  };
  nationality: {
    id: number;
    name: string;
    slug: string;
  };
  signature: string;
  signature2: string;
  username: string;
  referee_person: string;
}

export interface AdresseClientModel {
  id: number;
  location: string;
  created_at: Date;
  updated_at: Date;
  address_line: string;
  confirmed: boolean;
  city: number;
}

export interface ResponseDataForClientModel {
  response_data: IndividualClientModel;
  success: boolean;
  response_message: string;
  response_code: string;
}

export interface ResponseDataForCorporateModel {
  response_data: ClientCorporateModel;
  success: boolean;
  response_message: string;
  response_code: string;
}

export interface ClientCategoryTypeModel {
  id: number;
  title: string;
  text: string;
  client_type: {
    title: string;
    value: string;
  };
  is_custom: boolean;
  absolute_url: string;
  client_category_code_reporting: string;
  loan_nature_code_reporting: string;
}
export interface ResponseDataAfterUpdate {
  response_code: string;
  response_data: {
    changed: AutocompleteModel;
  };
  response_message: string;
  success: boolean;
}

export interface AccountTypeModel {
  id: string;
  account_type: {
    title: string;
  };
  currency: string;
  branch: {
    name: string;
  };
  client_category: {
    title: string;
  };
  client_category_type: {
    title: string;
  };
}

export interface ClientDetailModel {
  client_category_id: string;
  client_category_type_id: string;
}
export interface AccountCalculatedBalanceModel {
  response_message: string;
  response_data: {
    transactions_balance: string;
  };
}
export interface ResponseMOdel {
  object: {
    response_message: string;

    success: boolean;
  };
}
export interface AccountStatusModel {
  status: {
    status_css: string;
    status_title: string | null;
    reason: string | null;
    reason_explained: string | null;
  };

  operator: {
    name: string | null;
  };

  created_at: string | null;
}

export interface CreditsLineModel {
  id: number | string;
  crel_credit_limit: number;
  crel_account_info: {
    acc_account_type: string;
    acc_short_number: string;
  };
  crel_expiry_date: string;
  crel_fees: number;
  obj_created_by: string;
  crel_penalities_rate: string;
  crel_debitor_rate: string;
  crel_code: string;
  crel_paid: boolean;
  crel_branch_info: {
    name: string;
  };
}

export interface PrimaryDataModel {
  email?: string;
  phoneNumber?: string;
  is_primary: boolean;
}

export interface ContactInfo {
  id: number;
  is_primary: boolean;
  ident: string;
  is_verified: string;
}
export interface SignatoriesConfigsModel {
  id: number;
  status: {
    value: string;
    title: string;
    css: string;
  };
  groups_count: number;
  signatories: number;
  pv_document: string;
  minimum: number;
  client: number;
  confirmed_at: Date | null;
  confirmed_by: number | null;
  canceled_at: Date | null;
  canceled_by: number | null;
  signatory_groups: SignatoryGroupsModel[];
  created_at: Date;
}

export interface SignatoryGroupsModel {
  id: number;
  signature_order: number;
  status: {
    value: string;
    title: string;
    css: string;
  };
  exclusive: boolean;
  name: string;
  signatories: number;
  signatories_config: number;
  description: string;
}

export interface SignatoriesModel {
  id: number;
  status: {
    value: string;
    title: string;
    css: string;
  };
  SignatoryGroup: SignatoriesModel;
  client_profile: IndividualClientModel;
  confirmed_at: Date;
  confirmed_by: number;
  canceled_at: Date | null;
  canceled_by: number | null;
}

export interface SignatoriesAccountsModel {
  id: number;
  status: {
    value: string;
    title: string;
    css: string;
  };
  acounts: number;
  signatories_config: number;
  confirmed_at: Date;
  confirmed_by: number;
  canceled_at: Date | null;
  canceled_by: number | null;
}
