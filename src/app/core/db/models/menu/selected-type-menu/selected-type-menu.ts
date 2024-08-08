import { BaseModel, Field, UniqueField } from '../../base.model';

export class SelectedTypeMenu extends BaseModel {
  static tableName = 'selectedTypeMenu';

  @UniqueField static typeMenuName: string;
  @UniqueField static icon: string;
  @Field static menu_active_icon: string;
  @Field static menu_disabled_icon: string;
  @Field static active: boolean;
}
