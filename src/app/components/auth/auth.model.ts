import { languageModel } from '../../core/db/models/auth';

export interface EmailVerificationResponseModel {
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

export interface PhoneNumberVerificaitonResponseModel {
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
export interface CreateAccountResponseModel {
  object: {
    picture: string;
    number: number;
    email: string;
    response_message: string;
    success: boolean;
    client: {
      client_id: string;
    };
    user: {
      username: string;
      email: string;
      token: string;
    };
  };
}
export interface CreateAccountBodyModel {
  creation_client: number;
  organization: number | null;
  picture: string;
  write_picture: string | null | undefined;
  email: string | null | undefined;
  username: string | null | undefined;
}

export interface BankListResponseModel {
  name: string;
  organization_id: number;
  company: {
    logo: string;
  };
}
export interface ResetPasswordResponseModel {
  object: {
    success: boolean;
  };
}
export interface OtpVerificationResponseModel {
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

export interface CardIdDataModel {
  expiry_date: string | null | undefined;
}
export interface ReferenceNumberModel {
  id: number;
  event: string;
}

// Corporate Authentification
export interface ConnectedOperatorModel {
  operator: {
    id: string | number;
    isTeller: boolean;
    isTreasurer: boolean;
  };
  organization: OrganizationModel | null;
}

export interface OrganizationModel {
  accepts_login: boolean;
  bank_id: number;
  bank_ihela_code: number;
  company_type_code: string;
  company_type_name: string;
  id: number;
  is_active: boolean;
  is_erp: false;
  is_main: boolean;
  org_accounting_type: number;
  have_merchant_system: boolean;
  share_capital: number | string | null;
  slug: string;
  institution_client: {
    client_code: number;
    client_email: string;
    client_full_name: string;
    client_id: number;
    client_state: string | null;
    client_type: {
      css: string | null;
      title: string | null;
      value: string | null;
    };
    has_pin: boolean;
    id: number;
    is_agent: boolean;
    is_merchant: boolean;
    is_partner_bank: boolean;
    picture: string | null;
    prefered_language: languageModel;
  };
}

export interface LoginOperatorApiResponseModel {
  object: {
    success: boolean;
    response_code: string | number;
    response_message: string;
    response_data: {
      id: number;
      is_teller: boolean;
      is_treasurer: boolean;
      operator: {
        id: number;
        username: string;
        name: string;
      };
      organization: OrganizationModel;
    };
  };
}

export interface ConectedOperatorApiResponseModel {
  object: {
    success: boolean;
    response_code: string | number;
    response_message: string;
    response_data: {
      user: object;
      object?: {
        id: number;
        operator: {
          id: string | number;
          username: string;
          email: string | null;
          name: string;
        };
        organization: OrganizationModel;
        is_teller: boolean;
        is_treasurer: boolean;
      };
    };
  };
}

export interface OrganizationInvitationModel {
  id: number;
  operator: {
    id: number;
    name: string;
    picture: string | null;
  };
  organization: OrganizationModel;
}

export interface ResetPasswordBodyModel {
  otp_value: string | null | undefined;
  otp_type: string;
  otp_menu: string;
}
export interface SubmitInvitationResponseModel {
  success: string;
  response_message: string;
}

// export interface CreateAccountBodyModel {

export interface OtpVerificationBodyModel {
  otp_menu: string;
  otp_type: string;
  otp_data: {
    code: string | null | undefined;
    newPassword: string | null | undefined;
    confirnPassword: string | null | undefined;
  };
}
