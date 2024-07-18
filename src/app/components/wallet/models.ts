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
  title: string;
  code: string;
  available_balance: number;
  currency: string;
  account: {
    account_holder: string;
  };
}
