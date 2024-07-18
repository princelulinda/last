import { BaseModel, Field, UniqueField, MultiField } from '../base.model';
import { languageModel } from './user';

export class Operator extends BaseModel {
  static tableName = 'operator';

  @Field static isTeller: boolean;
  @Field static isTreasurer: boolean;

  @Field static staticaccepts_login: boolean;
  @UniqueField static bank_id: number;
  @UniqueField static bank_ihela_code: number;
  @UniqueField static company_type_code: string;
  @UniqueField static company_type_name: string;
  @Field static is_active: boolean;
  @UniqueField static is_erp: false;
  @UniqueField static is_main: boolean;
  @UniqueField static org_accounting_type: number;
  @MultiField static share_capital: number | string | null;
  @UniqueField static slug: string;
  @UniqueField static client_code: number;
  @UniqueField static client_email: string;
  @UniqueField static client_full_name: string;
  @UniqueField static client_id: number;
  @UniqueField static client_state: string | null;

  @UniqueField static has_pin: boolean;
  @Field static is_agent: boolean;
  @Field static is_merchant: boolean;
  @Field static staticis_partner_bank: boolean;
  @UniqueField static picture: string | null;
  @Field static prefered_language: languageModel;
}
