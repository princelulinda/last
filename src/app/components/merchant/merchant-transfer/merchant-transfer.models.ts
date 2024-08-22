export interface DoMerchantTransferModel {
  amount: number;
  credit_account: string;
  credit_account_holder: string;
  credit_bank: string;
  credit_type: string;
  pin_code: string;
  description: string;
  merchant_reference?: string;
}

export interface DoMerchantTransferResponseModel {
  object: {
    response_message: string;

    success: boolean;
  };
}
