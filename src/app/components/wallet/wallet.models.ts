import { ClientModel } from '../../core/db/models/auth';
import { CurrencyModel } from '../../global/models/global.models';
import { AccountDetailModel } from '../account/models';

export interface WalletTypModel {
  title: string;
  id: string;
}

export interface CreationWalletResponseModel {
  object: {
    response_message: string;
    success: boolean;
  };
}

export interface WalletTopUpBodyModel {
  amount: number;
  debit_account: number;
  debit_bank: string;
  description: string;
  pin_code: string | undefined;
  wallet_id: string;
}

export interface WalletModel {
  id: number;
  code: string;
  title: string;
  available_balance: string;
  actual_balance: string;
  transactions: number;
  currency: CurrencyModel;
  wallet_type_title: string;
  is_default: true;
  account: { id: number; account_holder: string };
  bank_id: number;
  bank_slug: string;
  client_id: number;
}

export interface walletDetailModel {
  id: number;
  code: string;
  title: string;
  available_balance: string;
  actual_balance: string;
  transactions: number;
  currency: CurrencyModel;
  wallet_type_title: string;
  is_default: true;
  account: AccountDetailModel;
  bank_id: number;
  bank_slug: string | null;
  client_id: number;
  client: ClientModel;
}
