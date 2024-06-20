import { ModeModel, ThemeModel } from '../../../services';
import { BaseModel, UniqueField } from '../base.model';

export interface mainConfigModel {
  activePlatform: string;
  activeTheme: ThemeModel;
  activeMode: ModeModel;
}

export class MainConfig extends BaseModel {
  static tableName = 'mainconfigs';

  @UniqueField static activePlatform = null;
  @UniqueField static activeTheme = null;
  @UniqueField static activeMode = null;
}
