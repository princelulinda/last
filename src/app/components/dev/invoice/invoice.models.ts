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

export interface InvoiceResponseModel {
  response_message: string;
  response_code: string;
  response_data: {
    code: string;
  };
  success: boolean;
}
