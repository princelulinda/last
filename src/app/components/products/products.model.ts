// import { MerchantModel, ProductModel } from "../dashboards/dashboard.model";

export interface ProductModel {
  id: number;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
}
export interface AllProductModel {
  objects: ProductModel[];
  count: number;
}

export interface MerchantModel {
  id: number | string;
  slug: string;
  merchant_title: string;
  merchant_code: string;
  merchant_logo: string;
  merchant_location: string;
  merchant_main_account: string;
  merchant_tellers_number: number;
  merchant_products_number: number;
  merchant_bills_payment_number: number;
  available_balance: number;
  balance_currency: number;
  client_category: string;
}

export interface MerchantObjectModel {
  // objects: MerchantModel,
  object: {
    response_data: MerchantModel;
  };
}
export interface MerchantObjectsModel {
  // objects: MerchantModel,
  object: {
    response_data: MerchantModel[];
  };
}
export interface ClientModel {
  id: number;
}

export interface MerchantInfoModel {
  id: number;
  available_balance: number;
  balance_currency: number;
  object: {
    response_data: MerchantModel;
  };
}

export interface StatsModel {
  object: {
    response_data: MerchantModel;
  };
  merchant_tellers_number: number;
  merchant_products_number: number;
  merchant_bills_payment_number: number;
}

export interface Account {
  acc_holder: string;
  acc_number: string;
}

export interface addProductByMerchantModel {
  name: string;
  merchant: MerchantModel;
  price: number | null;
  short_description: string;
  accepts_cart: boolean;
  is_stockable: boolean;
}

export interface addProductByMerchantDataModel {
  object: {
    success: boolean;
    response_message: string;
  };
}

export interface inputAmountModel {
  amount: number | null;
}
