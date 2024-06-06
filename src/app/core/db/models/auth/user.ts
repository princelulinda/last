import { BaseModel, Field } from '../base.model';

export class User extends BaseModel {
  @Field static username = null;
  @Field static token = null;
}
