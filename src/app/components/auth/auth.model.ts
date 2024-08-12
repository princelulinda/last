import { languageModel } from '../../core/db/models/auth';

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
      client_id: string;
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
