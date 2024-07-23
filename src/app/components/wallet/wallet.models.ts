export interface WalletCard {
  response_data: {
    code: string;
    currency: string;
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
}

export interface Walletdetail {
  actual_balance: number;
  title: string;
  code: string;
  available_balance: number;
  currency: 'BIF';
  account: {
    acc_holder: string;
  };
}
