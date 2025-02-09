import { ClientModel } from '../../../core/db/models/auth';
import { Teller_typeModel } from '../../merchant/merchant.models';
import { ProductModel } from '../../merchant/products/products.model';
import { MerchantModel } from '../agent/agent.models';

export interface InvoiceGroupModel {
  id: number;
  name: string | null;
  merchant_teller: {
    id: number;
    alias: string | null;
    client: ClientModel;
    merchant: MerchantModel;
    can_receive_notifications: boolean;
    is_active: boolean;
    teller_type: Teller_typeModel;
  };
  bills: number;
}

export interface InvoiceModel {
  provider: number;
  merchant: number;
  payment_data: {
    quantity: number;
  };
  measure: number;
  pin_code: number;
}

export interface ProvidersModel {
  id: number;
  provider: ProviderModel;
  product: {
    buying_price: number;
    selling_price: number;
    measure: MeasureModel;
  } & ProductModel;
}

export interface ProviderModel {
  id: number;
  client: ClientModel;
  products: number[];
}
export interface MeasureModel {
  id: number;
  name: string;
  quantity: number;
  suffix: string | null;
  price: number;
  unit_measure: number;
  unit_value: string;
}

export interface OrdersModel {
  id: number;
  product: {
    id: number;
    name: string;
    price: string | number;
    measure: MeasureModel;
  };
  payment: number;
  number: string | number;
  total_amount: string | number;
  element_metadata: {
    original_data: {
      quantity: string | number;
      client_name: string;
    };
  };
}
export interface SingleInVoiceModel {
  id: number;
  created_at: Date;
  code: string;
  merchant_teller: {
    id: number;
    client: ClientModel;
    merchant: MerchantModel;
    alias: string;
  };
  provider: ProviderModel;
  total_amount: string | number;
  currency: string;
  orders: OrdersModel[];
  payment_status: {
    title: string;
    value: string;
    css: string;
  };
}

export interface InvoiceResponseModel {
  response_message: string;
  response_code: string;
  response_data: {
    code: string;
    merchant: string[];
  };
  success: boolean;
}

export interface SingleInvoiceActionModel {
  success: boolean;
  response_message: string;
  response_code: string;
  response_data: object;
}

export interface createGroupResponseModel {
  id: number;
  name: string;
  merchant_teller: number;
}
