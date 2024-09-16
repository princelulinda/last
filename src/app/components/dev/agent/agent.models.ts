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
  slug: string;
  merchant_title: string;
  merchant_logo: null;
  is_active: boolean;
  client: Client;
}
