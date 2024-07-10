export interface WalletCard {
  response_data: {
    code: string;
    currency: string;
    available_balance: number;
  };
  success: boolean;
}
