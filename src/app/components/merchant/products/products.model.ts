import { MerchantModel } from '../merchant.models';
import { MetadataModel } from '../../metadatas/metadata.model';
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
  cart: boolean;
  incognito: boolean;
  stockable: boolean;
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
export interface FavoriteProductModel {
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

export interface ProductModel {
  id: number;
  slug: string;
  name: string;
  merchant: MerchantModel;
  short_description: string;
  icon: string | null;
  price: string | null;
  is_active: boolean;
  lookup_first: boolean;
  metadata: MetadataModel[];
  lookup_metadata: MetadataModel[];
  minimun_payment_amount: string;
  maximum_payment_amount: string;
  is_favorite_product: boolean;
  voucher_type: 'P' | 'L';
  accepts_multiple_payment: boolean;
  main_picture: string | null;
  gallery_pictures: [];
  product_visibility: string[];
  commissions_rate: string;
  fixed_commissions: string;
  commissions_by_merchant: boolean;
  has_api: boolean;
  custom_component: string | null;
  accepts_cart: boolean;
  isolated_card: boolean;
  is_stockable: boolean;
  incognito_mode: boolean;
}

export interface ProductLookupBodyModel {
  merchant_product_id: number;
  lookup_data: Record<string, string>;
  lookup_extra_data: Record<string, string>;
}
