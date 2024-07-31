import { BaseModel, Field, UniqueField } from '../base.model';

export class Menu extends BaseModel {
  static tableName = 'menus';

  @UniqueField static menu_name: string;
  @UniqueField static title: string;
  @UniqueField static value: string;
  @Field static required_operator_auth: boolean;
  @UniqueField static icon: string;
}
