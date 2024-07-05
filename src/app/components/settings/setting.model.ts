export interface MailModel {
  ident: string;
  is_primary: boolean;
  is_verified: boolean;
}

export interface BodyModel {
  pin_code: string;
  id_type: string;
  ident: string;
}
export interface PinModel {
  old_pin: number;
  new_pin: number;
  new_pin2: number;
}
export interface PasswordModel {
  old_password: number;
  new_password: number;
  new_password2: number;
}
