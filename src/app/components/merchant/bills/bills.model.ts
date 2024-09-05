import { ClientModel } from '../../../core/db/models/auth';
import { tellerObjectModel } from '../merchant.models';
import { OrdersModel } from '../products/products.model';

export interface BillsModel {
  id: number;
  created_at: string;
  code: string;
  merchant_teller: tellerObjectModel;
  created_by: ClientModel;
  client: ClientModel;
  payment_account: { acc_short_number: string };
  payment_status: {
    title: string;
    value: string;
  };
  total_amount: number | string;
  description: string;
  orders: OrdersModel[];
}
