import { BaseModel, Field } from '../base.model';

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
  @Field('userConfigFields') static username: string | null = null;
  @Field('userConfigFields') static email: string | null = null;
  @Field('userConfigFields') static fullName: string | null = null;
  @Field('userConfigFields') static hasPin = false;
  @Field('userConfigFields') static ihelaCode: number | null = null;
  @Field('userConfigFields') static phoneNumber: string | null = null;
  @Field('userConfigFields') static userToken = '';
  @Field('userConfigFields') static fcmData: object | null = null;
  @Field('userConfigFields') static deviceData: object | null = null;

  // constructor(username: string, email: string, fullName: string, hasPin: boolean, ihelaCode:number, phoneNumber: string, userToken: string, fcmData:object, deviceData: object) {
  //   super();
  // }
}
