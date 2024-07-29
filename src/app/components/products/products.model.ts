// import { MerchantModel, ProductModel } from "../dashboards/dashboard.model";

import { tellerObjectModel } from '../merchant/merchant.models';
import { ClientApiResponse } from '../../core/db/models/auth';

export interface ProductModel {
  id: number;
  name: string;
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

export interface AccountModel {
  acc_short_number: string;
  acc_bank_id: number;
}

export interface Account {
  acc_holder: string;
  acc_number: string;
}

export interface WalletModel {
  id: number;
  code: string;
  bank_id: number;
}

export interface OrdersModel {
  id: number;
  product: ProductModel;
  payment: number;
  number: number;
  amount: number;
  total_amount: string;
  api_sent_at: string;
  api_sent_response: {
    response_data: {
      printable_text: string;
    };
  };
  api_sent_reference: string;
}

export interface PaymentStatusModel {
  title: string;
  value: string;
}

export interface BillsModel {
  id: number;
  created_at: string;
  code: string;
  merchant_teller: tellerObjectModel;
  created_by: ClientApiResponse;
  client: ClientApiResponse;
  payment_account: { acc_short_number: string };
  payment_status: PaymentStatusModel;
  total_amount: number | string;
  description: string;
  orders: OrdersModel[];
}

export interface paymentBillsModel {
  object: BillsModel;
  objects: BillsModel[];
  count: number;
}

export interface OptionModel {
  selectedDebitOption: string;
  account: AccountModel;
  wallet: WalletModel;
}

export interface ErrorModel {
  object: {
    response_message: string;
  };
}

export interface ObjectBillModel {
  object: generateBillModel;
}

export interface generateBillModel {
  response_message: string;
  response_code: string;
  response_data: {
    code: string;
    refence: string;
  };
  success: boolean;
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
  lookup_icon: string;
  lookup_title: string;
  lookup_subtitle: string;
  price: string;
  icon: string;
  name: string;
}

export interface productConfigModel {
  // object: updateProdcutInfoModel;
  selectedProduct: selectedProductModel;
  product: number;
  merchant: number;
  action: string[];
  price: number;
  name: string;
  minimun_payment_amount: number;
  maximum_payment_amount: number;
  metadata: number[];
  pin_code: string;
  mininun_payment_amount: number;
  accepts_cart: boolean;
  is_stockable: boolean;
  incognito_mode: boolean;
  voucher_type: string;
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
