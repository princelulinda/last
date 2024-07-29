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
  id: number;
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

export interface updateProdcutInfoModel {
  product: number;
  merchant: number;
  action: string[];
  price: number;
  name: string;
  minimun_payment_amount: number;
  maximum_payment_amount: number;
  voucher_type: string;
  metadata: number[];
  pin_code: string;
}
export interface productConfigObjectModel {
  objects: productConfigModel;
  object: productConfigModel;
}

export interface productConfigModel {
  object: updateProdcutInfoModel;
  mininun_payment_amount: number;
  accepts_cart: boolean;
  is_stockable: boolean;
  incognito_mode: boolean;
}

export interface searchProductByMerchantModel {
  merchant: number;
  search: string | null;
}

export interface metadataModel {
  objects: metadataObjectModel[];
}
export interface updateProductInfoObjectModel {
  object: metadataObjectModel;
}
export interface metadataObjectModel {
  success: boolean;
  response_message: string;
  name: string;
  id: number;
}

export interface selectedProductModel {
  id: number;
  icon: string;
}
