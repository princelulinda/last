import { ClientModel } from '../../../core/db/models/auth';
import { CurrencyModel } from '../../../global/models/global.models';

export interface AgentModel {
  is_superagent: string;
  created_at: string | number | Date;
  balance_currency: CurrencyModel;
  agent_balance: string | number;
  agent_name: string;
  picture: string;
  client_id: string;
  picture_url: string;
  client: ClientModel;

  agent_main_account_id: string;
  accountId: string | undefined;
}
