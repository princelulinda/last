// import { MerchantModel, ProductAutocompleteModel} from "../dashboards/dashboard.model";

import {
  MerchantAutocompleteModel,
  tellerObjectModel,
} from '../merchant.models';
import { ClientApiResponse } from '../../../core/db/models/auth';
import { MerchantBillModel } from '../../../core/services/dialog/dialogs-models';

export interface ProductAutocompleteModel {
  id: number;
  price: number;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  is_favorite_product: boolean;
}

export interface AllProductAutocompleteModel {
  objects: ProductAutocompleteModel[];
  count: number;
}
export interface AllProductsModel {
  objects: ProductAutocompleteModel;
  count: number;
}

export interface MerchantModel {
  id: string;
  slug: string;
  merchant_title: string;
  merchant_code: string;
  merchant_logo: string;
  merchant_location: string;
  merchant_main_account: string;
  merchant_main_account_id: string;
  merchant_tellers_number: number;
  merchant_products_number: number;
  merchant_bills_payment_number: number;
  available_balance: number;
  balance_currency: number;
  client_category: string;
  client: ClientModel;
}

export interface MerchantObjectModel {
  // objects: MerchantModel,
  object: {
    response_data: MerchantModel;
    response_code: string;
    response_message: string;
    success: boolean;
  };
}
export interface MerchantObjectsModel {
  // objects: MerchantModel,
  object: {
    response_message: string;
    success: boolean;
    response_data: MerchantAutocompleteModel[];
  };
}
export interface ClientModel {
  id: number;
  client_id: number | string;
  client_code: string;
  client_full_name: string;
  client_email: string;
  client_phone_number: string;
}

export interface MerchantBillDataModel {
  data: MerchantBillModel;
  active?: {
    isActive: boolean | false;
    type: string;
  };
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
  product: {
    name: string;
    value: string;
  };
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

// export interface ErrorModel {
//   object: {
//     response_message: string;
//   };
// }

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

export interface addProductByMerchantModel {
  name: string;
  merchant: string;
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

export interface TransactionModel {
  id: number;
  created_at: string;
  operation_type: {
    id: number;
    code: string;
    description: string;
  };
  reference: string;
  pending_reference: string;
  extourne_reference: string;
  external_reference: string;
  description: string;
  account: {
    account_number: string;
    account_holder: string;
  };
  code: string;
  amount: number;
  // period: {
  //   start_date: Date;
  //   end_date: Date;
  // };
}

export interface TransactionObjectModel {
  objects: TransactionModel[];
  // period: {
  //   start_date: Date;
  //   end_date: Date;
  // };
}

export interface PeriodModel {
  start_date: string;
  end_date: string;
}

export interface updateProdcutInfoModel {
  product: number;
  merchant: string | number;
  action: string[];
  price: number;
  name: string;
  minimun_payment_amount: number;
  maximum_payment_amount: number;
  voucher_type: string;
  metadata: number[];
  pin_code: string;
}

export interface ProductConfigObjectsModel {
  objects: productConfigModel[];
}

export interface productConfigModel {
  id: number;
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

  object: productConfigModel;
  lookup_icon: string;
  lookup_title: string;
  lookup_subtitle: string;
  icon: string;
}

export interface searchProductByMerchantModel {
  merchant: string | number;
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

export interface ProductFavoriteModel {
  product: string;
  product_action: string;
}

export interface FavoriteModel {
  object: {
    success: boolean;
    response_code: string;
    response_data: {
      client: string;
      product: string;
    };
    response_message: string;
  };
}

export interface SectorActivityModel {
  id: number | string;
  title: string;
  text: string;
  activity_sector_code_reporting: string;
  comment: string;
  absolute_url: string;
}

export interface SectorActivityObjectModel {
  objects: SectorActivityModel[];
}

export interface CategoriesPerActivitySectorModel {
  id: number | string;
  slug: string;
  name: string;
}

export interface CategoriesPerActivitySectorObjectModel {
  objects: CategoriesPerActivitySectorModel[];
}
