import { BaseModel, Field, UniqueField } from '../base.model';

export class Access extends BaseModel {
  static tableName = 'access';

  @UniqueField static access_id: number;
  @Field static access_code: string;
  @UniqueField static access_type: string;
}
