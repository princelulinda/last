import { Field, UniqueField } from '../../base.model';

export class MenuGroup {
  static tableName = 'menuGroup';

  @UniqueField static typeMenuName: string;
  @UniqueField static groupName: string;
  @UniqueField static icon: string | null;
  @Field static required_operator_auth: boolean;
  @UniqueField static typeMenuvalue: string;
  @Field static active: boolean;
}
