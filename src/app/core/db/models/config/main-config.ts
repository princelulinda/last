import { BaseModel, Field } from '../base.model';

export class MainConfig extends BaseModel {
  tableName = 'mainconfigs';

  @Field static activePlatform = null;
  @Field static activeTheme = null;
  @Field static activeMode = null;
}
