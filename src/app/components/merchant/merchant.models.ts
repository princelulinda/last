export interface tellersModel {
  objects: tellerObjectModel[];
}
export interface tellerModel {
  object: tellerObjectModel;
}

export interface tellerObjectModel {
  id: string;
  client: tellerClienModel;
  merchant: tellerMerchantModel;
  is_active: boolean;
  can_receive_notifications: boolean;
  teller_type: teller_typeModel;
  can_receive_tip: boolean;
  alias: string;
  success: boolean;
  response_message: string;
  response_data: string;
}
export interface tellerClienModel {
  id: number;
  client_id: number;
  client_code: string;
  client_type: tellerClien_typeModel;
  client_full_name: string;
  client_email: string;
  client_phone_number: string;
  picture: string;
  prefered_language: string;
  is_agent: boolean;
  is_merchant: boolean;
}

export interface tellerClien_typeModel {
  title: string;
  value: string;
}

export interface tellerMerchantModel {
  id: number;
  merchant_title: string;
  name: string;
  code: string;
  accepts_simple_payment: boolean;
  accepts_cart: boolean;
  visible: boolean;
  slug: string;
  api_plug_name: string;
  client_visibility_activated: boolean;
  merchant_code: string;
}

export interface teller_typeModel {
  title: string;
  value: string;
}

/****************end of teller related values */

export interface dialogModel {
  response: string;
  action: string;
}

export interface doTellerActionModel {
  object: doTellerActionObjectModel;
}

export interface doTellerActionObjectModel {
  success: boolean;
  response_message: string;
}

export interface doTellerBodyModel {
  teller: string;
  action: string;
}
export interface updateMerchantDetailsModel {
  merchant: string;
  merchant_title: string;
  slug: string;
  action: string[];
  merchant_category: string;
  merchant_logo: string;
}

// export interface getMerchantInfosObjectModel {
//  object: merchantInfoModel;
// }

export interface getMerchantInfosModel {
  object: merchantInfObjectModel;
}

export interface merchantInfObjectModel {
  response_data: merchantInfoModel;
  success: boolean;
  response_code: string;
  response_message: string;
}

export interface merchantInfoModel {
  id: string;
  merchant_title: string;
  merchant_code: string;
  merchant_logo: string;
  merchant_location: string;
  action: string[];
  client: tellerClienModel;
  accepts_simple_payment: boolean;
  accepts_cart: boolean;
  client_visibility_activated: boolean;
  merchant_category: tellerMerchantModel;
  is_favorite_merchant: boolean;
  visible: boolean;
  slug: string;
  api_plug_name: string;
}

export interface searchTellerModel {
  merchant: string;
  search: string;
}

export interface newTellerModel {
  client: number | undefined;
  merchant: string;
  can_receive_notifications: boolean;
  alias: string;
}

export interface MerchantAutocompleteModel {
  id: number;
  lookup_icon: string;
  lookup_image: string;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string;
  lookup_has_image_or_icon: boolean;
  accepts_simple_payment: boolean;
  merchant_category_name: string;
  is_favorite_merchant: boolean;
}

export interface SectorActivityModel {
  id: number | string;
  title: string;
  text: string;
  activity_sector_code_reporting: string;
  comment: string;
  absolute_url: string;
}

export interface MerchantCategoriesModel {
  id: number | string;
  slug: string;
  name: string;
  merchant_visibility: string[];
  merchant_activity_sector: SectorActivityModel[];
  icon: string;
  is_active: boolean;
  ordering: number;
}
