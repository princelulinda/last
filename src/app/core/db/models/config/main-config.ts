import {
  ModeModel,
  ThemeModel,
} from '../../../services/config/main-config.models';
import { BaseModel, UniqueField } from '../base.model';

export interface mainConfigModel {
  activePlatform: string;
  activeTheme: ThemeModel;
  activeMode: ModeModel;
  screenLocked: boolean;
}

export class MainConfig extends BaseModel {
  static tableName = 'mainconfigs';

  @UniqueField static activePlateform = null;
  @UniqueField static activeTheme = null;
  @UniqueField static activeMode = null;
  @UniqueField static screenLocked = false;
}
