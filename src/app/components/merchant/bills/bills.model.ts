import { ClientModel } from '../../../core/db/models/auth';
import { MerchantBillModel } from '../../../core/services/dialog/dialogs-models';
import { tellerObjectModel } from '../merchant.models';
import { OrdersModel, PaymentStatusModel } from '../products/products.model';

export interface BillsModel {
  id: number;
  created_at: string;
  code: string;
  merchant_teller: tellerObjectModel;
  created_by: ClientModel;
  client: ClientModel;
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

export interface MerchantBillDataModel {
  data: MerchantBillModel;
  active?: {
    isActive: boolean | false;
    type: string;
  };
}
