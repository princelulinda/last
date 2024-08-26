import { BaseModel, Field, UniqueField, MultiField } from '../base.model';

export interface UserApiResponse {
  username: string;
  token: string;
  fcm_data: object;
  device_data: object;
}

export type languageModel = 'en' | 'fr' | 'ki' | 'sw';

export interface ClientModel {
  id: number;
  client_id: number;
  client_full_name: string;
  client_phone_number: string;
  client_type: {
    title: string;
    value: string;
    css: object | null;
  };
  client_email: string;
  client_code: number;
  picture: string;
  picture_url: string;
  has_pin: boolean;
  is_agent: boolean;
  is_merchant: boolean;
  is_partner_bank: boolean;
  prefered_language: languageModel;
}
export interface UserInfoModel {
  user: UserApiResponse;
  client: ClientModel;
}

export class User extends BaseModel {
  static tableName = 'users';

  @UniqueField static username: string | null = null;
  @UniqueField static userToken = '';
  @MultiField static fcmData: object | null = null;
  @MultiField static deviceData: object | null = null;

  @UniqueField static email: string | null = null;
  @Field static fullName: string | null = null;
  @Field static hasPin = false;
  @UniqueField static ihelaCode: number | null = null;
  @UniqueField static phoneNumber: string | null = null;
  @UniqueField static client_id: number;
  // @UniqueField static client_full_name: string;
  // @UniqueField static client_phone_number: string;
  @Field static client_type: string;
  // @UniqueField static client_email: string;
  // @UniqueField static client_code: number;
  @UniqueField static picture_url: string;
  @Field static is_agent: boolean;
  @Field static is_merchant: boolean;
  @Field static is_partner_bank: boolean;
  @Field static prefered_language: languageModel;
}
