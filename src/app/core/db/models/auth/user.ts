import { BaseModel, Field, UniqueField, MultiField } from '../base.model';

export interface UserApiResponse {
  username: string;
  token: string;
  fcm_data: object;
  device_data: object;
}

export type languageModel = 'en' | 'fr';

export interface ClientApiResponse {
  id: number;
  client_id: number;
  client_full_name: string;
  client_phone_number: string;
  client_type: string;
  client_email: string;
  client_code: number;
  picture_url: string;
  has_pin: boolean;
  is_agent: boolean;
  is_merchant: boolean;
  is_partner_bank: boolean;
  prefered_language: languageModel;
}
export interface UserInfoModel {
  user: UserApiResponse;
  client: ClientApiResponse;
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
