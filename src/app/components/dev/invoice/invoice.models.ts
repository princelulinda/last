import { ClientModel } from '../../../core/db/models/auth';
import { ProductModel } from '../../merchant/products/products.model';

export interface InvoiceGroupModel {
  id: number;
  name: string;
  merchant_teller: {
    id: number;
    alias: string;
  };
}

export interface InvoiceModel {
  provider: number;
  merchant: number;
  payment_data: {
    quantity: number;
  };
  measure: number;
  pin_code: number;
  merchant_product_id: number;
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
  suffix: string;
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
  provider: ProviderModel;
  total_amount: string | number;
  orders: OrdersModel[];
}
