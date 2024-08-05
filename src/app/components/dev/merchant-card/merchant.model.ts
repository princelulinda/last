export interface Merchant_AutocompleteModel {
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
