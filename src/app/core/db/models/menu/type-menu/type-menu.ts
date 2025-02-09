import { BaseModel, Field, UniqueField } from '../../base.model';

export class TypeMenu extends BaseModel {
  static tableName = 'typeMenu';

  @UniqueField static typeMenuName: string;
  @UniqueField static icon: string;
  @Field static menu_active_icon: string;
  @Field static menu_disabled_icon: string;
  @Field static active: boolean;

  @UniqueField static groupName: string;
  @Field static required_operator_auth: boolean;
  @UniqueField static typeMenuvalue: string;
}
