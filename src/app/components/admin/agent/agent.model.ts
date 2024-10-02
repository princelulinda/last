import { CurrencyModel } from '../../../global/models/global.models';

export interface DetailsAgentResponseModel {
  is_superagent: string;
  created_at: string | number | Date;
  balance_currency: CurrencyModel;
  agent_balance: string | number;
  agent_name: string;
  picture: string;
  client_id: string;
  picture_url: string;
  client: {
    is_merchant: string;
    client_cathegory: string;
    client_email: string;
    client_type: {
      title: string;
    };
    client_full_name: string;
    client_code: string;
  };

  agent_main_account_id: string;
  accountId: string | undefined;
}
