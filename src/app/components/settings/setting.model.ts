export interface MailModel {
  ident: string;
  is_primary: boolean;
  is_verified: boolean;
}
export interface phoneNumberModel {
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
  old_pin: string;
  new_pin: string;
  new_pin2: string;
}
export interface PasswordModel {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export interface PinChangeResponse {
  object: {
    response_message: string;

    success: boolean;
  };
}
export interface PasswordChangeResponse {
  object: {
    response_message: string;

    success: boolean;
  };
}

export interface AddResponse {
  object: {
    response_message: string;

    success: boolean;
  };
}

export interface activeSessionResponse {
  objects: activeSessionResponse[];
  count: number;
  length: number;
  id: string;
  location: string;
  user_ip_address: string;
  session_duration: string;
  device: {
    user_agent_data: {
      device_brand: {
        family: string;
      };
      browser: {
        family: string;
      };
      os: {
        family: string;
      };
    };
  };
}
export interface historySessionResponse {
  count: number;
  objects: historySessionResponse[];
  location: string;
  user_ip_address: string;
  id: string;
  session_duration: Date;
  last_activity: string;
  device: {
    user_agent_data: {
      device_brand: {
        family: string;
      };
      browser: {
        family: string;
      };
      os: {
        family: string;
      };
    };
  };
}
