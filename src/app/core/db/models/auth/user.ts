import { BaseModel, Field, FieldMulti, FieldUnique } from '../base.model';

export interface UserApiResponse {
  username: string;
  email: string;
  full_name: string;
  has_pin: boolean;
  ihela_code: number;
  phone_number: string;
  token: string;
  fcm_data: object;
  device_data: object;
}

export class User extends BaseModel {
  @FieldUnique('userConfigFields') static username: string | null = null;
  @FieldUnique('userConfigFields') static email: string | null = null;
  @FieldUnique('userConfigFields') static fullName: string | null = null;
  @FieldMulti('userConfigFields') static hasPin = false;
  @FieldMulti('userConfigFields') static ihelaCode: number | null = null;
  @Field('userConfigFields') static phoneNumber: string | null = null;
  @Field('userConfigFields') static userToken = '';
  @Field('userConfigFields') static fcmData: object | null = null;
  @Field('userConfigFields') static deviceData: object | null = null;

  // constructor(username: string, email: string, fullName: string, hasPin: boolean, ihelaCode:number, phoneNumber: string, userToken: string, fcmData:object, deviceData: object) {
  //   super();
  // }
}
