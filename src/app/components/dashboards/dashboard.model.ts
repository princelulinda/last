export interface BillersModel {
  lookup_image: string;
  lookup_title: string;
}

export interface MerchantModel {
  code: string;
  id: number;
  merchant_title: string;
}

export interface ProductModel {
  id: number;
  name: string;
  price: number;
  icon: string;
  merchant: MerchantModel;
}
