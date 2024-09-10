import { CurrencyModel } from '../../global/models/global.models';

export interface nyamuranziCardModel {
  response_data: {
    commissions: number;
    currency: CurrencyModel;
    referred_count: number;
  };
  success: boolean;
}
