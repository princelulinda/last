import { BaseModel, Field, UniqueField, MultiField } from '../base.model';

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
  static tableName = 'users';

  @UniqueField static username: string | null = null;
  @UniqueField static email: string | null = null;
  @Field static fullName: string | null = null;
  @Field static hasPin = false;
  @UniqueField static ihelaCode: number | null = null;
  @UniqueField static phoneNumber: string | null = null;
  @UniqueField static userToken = '';
  @MultiField static fcmData: object | null = null;
  @MultiField static deviceData: object | null = null;

  // constructor(username: string, email: string, fullName: string, hasPin: boolean, ihelaCode:number, phoneNumber: string, userToken: string, fcmData:object, deviceData: object) {
  //   super();
  // }
}
