export interface Pagination {
  filters?: {
    limit?: number | string;
    offset?: number | string;
  };
}

export interface Favorite {
  merchant: string;
  merchant_action: string;
}

export interface PaymentMerchantPayloadModel {
  type:
    | 'merchant'
    | 'product'
    | 'biller'
    | 'category-merchant'
    | 'category-product'
    | null;
  id: number | null;
  merchant?: object;
  product?: object;
  biller?: object;
  category?: object;
}
export interface PaymentMerchantModel extends PaymentMerchantPayloadModel {
  active: boolean;
}
