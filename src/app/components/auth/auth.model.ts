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
  };
}

export interface bankListResponse {
  name: string;
  organization_id: number;
  company: {
    logo: string;
  };
}
