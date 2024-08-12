export interface MerchantResFav {
  response_code: string;
  response_data: {
    client: string;
    merchant: string;
  };
  response_message: string;
  success: boolean;
}
