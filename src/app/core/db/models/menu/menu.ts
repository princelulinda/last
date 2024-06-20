import { BaseModel, Field } from '../base.model';

export class Menu extends BaseModel {
  static tableName = 'menus';

  @Field static title = null;
}
