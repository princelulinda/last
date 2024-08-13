export interface MobileBanksModel {
  name: string;
  id: string;
  institution_client: string;
  company: {
    logo: string;
    name: string;
  };
}
export interface MappingResponse {
  object: {
    response_message: string;

    success: boolean;
  };
}

export interface DebitOptionModel {
  account: string;
}
export interface MappingBody {
  to_client: string;
  //accountId: string;
  pin_code: string;
  //operator:string
  ident: string;
  account: string;
  id_type: string;
  mapping_type: string;
}
