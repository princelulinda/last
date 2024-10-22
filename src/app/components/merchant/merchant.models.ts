import { ClientModel } from '../../core/db/models/auth';
import { CurrencyModel } from '../../global/models/global.models';

export interface tellersModel {
  length: number;
  objects: tellerObjectModel[];
}
export interface tellerModel {
  success: boolean;
  response_message: string;
  id: number;
  object: tellerObjectModel;
}

export interface tellerObjectModel {
  length: number;
  id: string;
  client: ClientModel;
  merchant: tellerMerchantModel;
  is_active: boolean;
  can_receive_notifications: boolean;
  teller_type: Teller_typeModel;
  can_receive_tip: boolean;
  alias: string;
  success: boolean;
  response_message: string;
  response_data: string;
}

export interface tellerClien_typeModel {
  title: string;
  value: string;
}

export interface tellerMerchantModel {
  id: number;
  merchant_title: string;
  name: string;
  code: string;
  accepts_simple_payment: boolean;
  accepts_cart: boolean;
  visible: boolean;
  slug: string;
  api_plug_name: string;
  client_visibility_activated: boolean;
  merchant_code: string;
}

export interface Teller_typeModel {
  title: string;
  value: string;
}

/****************end of teller related values */

export interface dialogModel {
  response: string;
  action: string;
}

export interface doTellerActionModel {
  object: doTellerActionObjectModel;
}

export interface doTellerActionObjectModel {
  success: boolean;
  response_message: string;
}

export interface doTellerBodyModel {
  teller: string;
  action: string;
}
export interface updateMerchantDetailsModel {
  object: {
    success: string;
  };
  id: number;
  merchant: string;
  merchant_title: string;
  slug: string;
  action: string[];
  merchant_category: string;
  merchant_logo: string;
}

export interface MerchantModel {
  payment_bills: string;
  has_cashin: string;
  id: string;
  slug: string;
  merchant_title: string;
  merchant_code: string;
  merchant_logo: string;
  merchant_location: {
    longitude: number;
    latitude: number;
  };
  action: string[];
  client: ClientModel;
  accepts_simple_payment: boolean;
  accepts_cart: boolean;
  client_visibility_activated: boolean;
  reference_client: ClientModel;
  merchant_category: MerchantCategoriesModel;
  is_favorite_merchant: boolean;
  visible: boolean;
  available_balance: string;
  api_plug_name: string;
  is_active: string;
  merchant_main_account: string;
  merchant_main_account_id: string;
  client_category: string;
  client_category_id: string;
  balance_currency: CurrencyModel;
  paid_amount: string;
  is_teller_admin: boolean;
}

export interface MerchantStatsModel {
  success: boolean;
  response_data: {
    merchant_tellers_number: number;
    merchant_bills_payment_number: number;
    merchant_products_number: number;
  };
  response_message: string;
  response_code: string;
}

export interface MerchantInfoModel {
  response_data: MerchantModel;
  response_code: string;
  response_message: string;
  success: boolean;
}

export interface searchTellerModel {
  merchant: string;
  search: string;
}

export interface newTellerModel {
  client: number | undefined;
  merchant: string;
  can_receive_notifications: boolean;
  alias: string;
}
export interface updateMerchantDetailsBodyModel {
  merchant: string;
  merchant_title: string;
  slug: string;
  action: string[];
  merchant_category: string;
  merchant_logo: string;
}

export interface MerchantAutocompleteModel {
  id: number;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  accepts_simple_payment: boolean;
  merchant_category_name: string;
  is_favorite_merchant: boolean;
}

export interface SectorActivityModel {
  id: number | string | null;
  title: string | null;
  text: string;
  activity_sector_code_reporting: string;
  comment: string;
  absolute_url: string;
}

export interface MerchantCategoriesModel {
  id: number | string;
  slug: string;
  name: string;
  merchant_visibility: string[];
  merchant_activity_sector: SectorActivityModel | null;
  icon: string;
  is_active: boolean;
  ordering: number;
}

export interface BillersAutocompleteModel {
  id: number;
  lookup_image: string | null;
  lookup_title: string;
  lookup_icon: string;
  icon: string;
  lookup_subtitle: string;
  is_favorite_merchant: boolean;
  merchant_category_name: string;
  accepts_simple_payment: boolean;
  price: string | null;
}

export interface SectorActivityAutocompleteModel {
  id: number | string;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
}

export interface MerchantCategoriesAutocompleteModel {
  id: number | string;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
}

export interface PayMerchantBodyModel {
  merchant_product_id: number;
  debit_bank: number;
  debit_account: string;
  debit_type: string;
  debit_account_holder: string;
  pin_code: string;
  payment_data?: Record<string, string>;
  lookup_data?: Record<string, string>;
  is_multiple_payment?: boolean;
  payment_details?: {
    payment_data?: Record<string, string>;
    lookup_data?: Record<string, string>;
  }[];
}

export interface PayMerchantResponseModel {
  response_message: string;
  response_code: string;
  response_data: {
    id: number;
    reference: string;
    cbs_reference: string;
    pending_operation: string;
    date: string;
    amount: string;
    bill: string;
    return_icon: string;
    orders: [{ printable_text: string | null; sent_at: string }];
  };
  success: boolean;
}

export interface MerchantSimplePaymentBodyModel {
  payment_id?: number;
  amount: string;
  debit_account: string;
  debit_bank: number;
  debit_type: string;
  description: string;
  merchant_id: number;
  pin_code: string;

  give_tip?: boolean;
  merchant_teller_id?: number;
  tip_level?: string;
  custom_tip_amount?: number;
}
export interface MerchantSimplePaymentResponseModel {
  response_message: string;
  response_code: '00';
  response_data: {
    id: number;
    delivered_to: string;
    reference: string;
    cbs_reference: string;
    pending_operation: string;
    date: string;
    amount: string;
    tip_amount: string;
    bill: string;
    return_icon: string;
    orders: {
      printable_text: null | string;
      sent_at: string;
      payment_data: {
        original_data: { client_name: string };
      };
    }[];
  };
  success: boolean;
}
export interface merchantLocationModel {
  lng: string;
  lat: string;
}
export interface ProductsModel {
  lookup_title: string;
  lookup_icon: string;
  price: string | number;
  name: string;
  icon: string;
  length: number;
}
export interface ProductModel {
  is_stockable: string;
  incognito_mode: string;
  accepts_cart: string;
  voucher_type: string;
  minimun_payment_amount: string;
  maximum_payment_amount: string | number;
  price: number;
  name: string;
}
// export interface ProductsObjectsModel{
// lookup_title: string;
// lookup_icon: string;
// price: string|number;
// name: string;
// icon: string;
// length: number;
// }

export interface getMerchantsProductsDetailsModel {
  is_stockable: boolean;
  incognito_mode: string;
  accepts_cart: string;
  voucher_type: string;
  minimun_payment_amount: number;
  price: number;
  name: string;
  id: string;
}
export interface TopClientsByAmountModel {
  balance_currency: CurrencyModel;
  total_paid: string | number;
  response_data: TopClientsByAmountModel[];
  num_payments: number;
  client_code: string;
  client_full_name: string;
  picture: string;
}
export interface topClientsByTransactionsModel {
  response_data: topClientsByTransactionsModel[];
  balance_currency: CurrencyModel;
  total_paid: string | number;
  num_payments: number;
  client_code: string;
  client_full_name: string;
  picture: string;
}
export interface getPaymentStatsModel {
  response_data: getPaymentStatsModel[];
  currency: CurrencyModel;
  total_amount: string | number;
  code: string;
  description: string;
  client: {
    client_full_name: string;
    client_code: string;
  };
  payment_status: {
    title: string;
    css: string;
  };
  created_at: string | number | Date;
}
export interface MetadataModel {
  id: number;
  name: string;
  objects: MetadataModel;
  metadata: null;
  length: number;
}

export interface TellerAutoCompleteModel {
  id: number;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  merchant: string;
  can_receive_tip: boolean;
}
