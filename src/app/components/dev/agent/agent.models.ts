export interface AgentModel {
  agent_name: string;
  agent_type: string;
  agent_main_account_id: number;
  agent_main_account: string;
  agent_balance: string;
  available_balance: string;
  balance_currency: string;
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

export interface ResponseAgentDepositModel {
  response_data: object;
  success: boolean;
  response_message: string;
  response_code: string;
}
