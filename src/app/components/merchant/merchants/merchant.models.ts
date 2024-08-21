import { MerchantAutocompleteModel } from '../merchant.models';

export interface MerchantResFav {
  response_code: string;
  response_data: {
    client: string;
    merchant: string;
  };
  response_message: string;
  success: boolean;
}

export interface SectorActivityModel {
  id: number | string;
  title: string;
  text: string;
  activity_sector_code_reporting: string;
  comment: string;
  absolute_url: string;
}

export interface SectorActivityObjectModel {
  objects: SectorActivityModel[];
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

export interface MerchantCategoriesObjectModel {
  objects: MerchantCategoriesModel[];
}

export interface MerchantAutocompleteObjectModel {
  objects: MerchantAutocompleteModel[];
  count: number;
}
