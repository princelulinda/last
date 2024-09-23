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
}

export interface ClientCorporateModel {
  id: number;
  ident: number;
  corp_name: string;
  corp_abrv_name: string;
  activity_sector: string;
  corp_head_quarters: string;
  fisc: FiscModel[];
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
