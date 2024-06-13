import { BaseModel, Field } from '../base.model';

export class Menu extends BaseModel {
  @Field('menuFields') static title = null;
}
