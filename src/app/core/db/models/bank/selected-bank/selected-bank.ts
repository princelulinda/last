import { BaseModel, Field, MultiField, UniqueField } from '../../base.model';

export class SelectedBank extends BaseModel {
  static tableName = 'selectedBank';

  @MultiField static slug: string | null = null;
  @UniqueField static bank_name: string | null = null;
  @MultiField static bank_type: string | null = null;
  @UniqueField static bank_code: string | null = null;
  @Field static organization_id: string | null = null;
  @Field static is_active: boolean;
  @Field static is_default: boolean;
  // @Field static company: {
  @MultiField static about: string | null = null;
  @UniqueField static fullname: string | null = null;
  @UniqueField static image: string | null = null;
  @UniqueField static logo: string | null = null;
  @UniqueField static logo_icon: string | null = null;
  @UniqueField static company_name: string | null = null;
  @UniqueField static nickname: string | null = null;
  // @MultiField static slug: string;
  // };
}
