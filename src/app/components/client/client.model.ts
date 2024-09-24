export interface ClientWorkstationModel {
  id: number | string;
  client_id: number | string;
  client_full_name: string;
  client_type: string;
  client_code: string;
  client_classification: {
    title: string;
    value: string;
    css: string;
  };
  client_last_activity: string;
  client_category_title: string;
  client_category_id: number;
  client_category_type_title: string;
  client_category_type_id: number;
  client_is_custom: boolean;
  picture_url: string;
  client_email: string;
  client_phone_number: string;
  client_is_secret: boolean;
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
  addresses: AdresseClientModel[];
}

export interface FiscModel {
  id: number;
  trade_register_number: string;
  trn_file: string;
  trn_issue_date: string;
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
  telephones: string;
  success: boolean;
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

export interface ResponseModel {
  response_data: IndividualClientModel;
  success: boolean;
  response_message: string;
  response_code: string;
}
