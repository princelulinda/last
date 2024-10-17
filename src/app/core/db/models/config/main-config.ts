import { BaseModel, UniqueField } from '../base.model';

export class MainConfig extends BaseModel {
  static tableName = 'mainconfigs';

  @UniqueField static activePlateform = null;
  @UniqueField static activeTheme = null;
  @UniqueField static activeMode = null;
  @UniqueField static screenLocked = false;
}
