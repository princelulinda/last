import { BaseModel } from '../base.model';

export interface User2 extends BaseModel {
  username: string;
}

export class User extends BaseModel {
  static username = null;
  static token = null;
}
