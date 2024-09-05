import { CurrencyModel } from '../../global/components/custom-field/currency.model';

export interface WalletCardModel {
  response_data: {
    id: string;
    code: string;
    currency: CurrencyModel;
    available_balance: number;
  };
  success: boolean;
}
export interface WalletList {
  title: string;
  account: {
    account_holder: string;
  };
  id: string;
  code: string;
  available_balance: number;
  currency: 'BIF';
  bank_id: string;
}

export interface WalletTypModel {
  title: string;

  id: string;
}

export interface CreatWalletResponse {
  object: {
    response_message: string;

    success: boolean;
  };
}

export interface mainConfigModel {
  activeMode: string;
  activePlateform: string;
  activeTheme: string;
}
export interface WalletTopUpBodyModel {
  amount: number;
  debit_account: number;
  debit_bank: string;
  description: string;
  pin_code: string | undefined;
  wallet_id: string;
}

export interface WalletDetail {
  actual_balance: number;
  title: string;
  code: string;
  available_balance: number;
  currency: 'BIF';
  account: {
    acc_holder: string;
  };
}
