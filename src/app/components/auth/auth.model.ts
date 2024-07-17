export interface EmailVerificationResponse {
  object: {
    success: boolean;
    response_message: string;
    response_code: string;
    response_data: {
      object: {
        verification: boolean;
      };
    };
  };
}

export interface phoneNumberVerificaitonResponse {
  object: {
    success: boolean;
    response_message: string;
    response_code: string;
    response_data: {
      object: {
        verification: boolean;
      };
    };
  };
}
export interface createAccountResponse {
  object: {
    picture: string;
    number: number;
    email: string;
    response_message: string;
    success: boolean;
    client: {
      client_id: number;
    };
    user: {
      username: string;
      email: string;
      token: string;
    };
  };
}

export interface bankListResponse {
  name: string;
  organization_id: number;
  company: {
    logo: string;
  };
}
export interface resetPasswordResponse {
  object: {
    success: boolean;
  };
}
export interface otpVerificationResponse {
  object: {
    success: boolean;
  };
}
export interface UploadedFileModel {
  object: {
    uuid: string;
    docfile: string;
  };
}

export interface cardIdData {
  expiry_date: string | null | undefined;
}
export interface referenceNumberModel {
  id: number;
  event: string;
}
