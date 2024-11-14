export interface AgentModel {
  agent_name: string;
  agent_type: string;
  agent_main_account_id: number;
  agent_balance: string;
  cios_balance: string;
  picture: string;
}

export interface AgentResModel {
  response_code: string;
  response_data: AgentModel;
  response_message: string;
  success: boolean;
}

export interface Client {
  client_code: string;
}

export interface MerchantModel {
  id: number;
  slug: string;
  merchant_title: string;
  merchant_logo: null;
  is_active: boolean;
  code: string;
  client: Client;
}

export interface AgentBanksModel {
  id: number;
  slug: string;
  name: string;
  bank_code: number;
  bank_type: string;
  can_create_account_online: boolean;
  is_active: boolean;
  company: AgentCompanyModel;
}

export interface AgentCompanyModel {
  id: number;
  name: string;
  fullname: string;
  slug: string;
  image: string;
  about: string;
  logo: string;
  logo_icon: string;
}
