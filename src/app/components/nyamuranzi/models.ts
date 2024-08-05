import { CurrencyModel } from '../../global/components/custom-field/currency.model';

export interface nyamuranziCard {
  response_data: {
    commissions: number;
    currency: CurrencyModel;
    referred_count: number;
  };
  success: boolean;
}
