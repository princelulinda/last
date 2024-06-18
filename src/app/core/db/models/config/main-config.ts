import { ModeModel, ThemeModel } from '../../../services';
import { BaseModel, Field } from '../base.model';

export interface mainConfigModel {
  activePlatform: string;
  activeTheme: ThemeModel;
  activeMode: ModeModel;
}

export class MainConfig extends BaseModel {
  static tableName = 'mainconfigs';

  @Field('configFields') static activePlatform = null;
  @Field('configFields') static activeTheme = null;
  @Field('configFields') static activeMode = null;
}
