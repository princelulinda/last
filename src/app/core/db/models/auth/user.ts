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
  @Field static username: string | null = null;
  @Field static email: string | null = null;
  @Field static fullName: string | null = null;
  @Field static hasPin = false;
  @Field static ihelaCode: number | null = null;
  @Field static phoneNumber: string | null = null;
  @Field static userToken = '';
  @Field static fcmData: object | null = null;
  @Field static deviceData: object | null = null;

  // constructor(username: string, email: string, fullName: string, hasPin: boolean, ihelaCode:number, phoneNumber: string, userToken: string, fcmData:object, deviceData: object) {
  //   super();
  // }
}
