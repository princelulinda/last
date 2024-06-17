import { BaseModel, Field } from '../base.model';

export class MainConfig extends BaseModel {
  static tableName = 'mainconfigs';

  @Field('configFields') static activePlatform = null;
  @Field('configFields') static activeTheme = null;
  @Field('configFields') static activeMode = null;
}
