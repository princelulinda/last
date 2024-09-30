export interface AutocompleteModel {
  id: number;
  lookup_icon: string | null;
  lookup_image: string | null;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string | null;
  lookup_has_image_or_icon: boolean;
}
export type CurrencyModel = 'BIF' | '$' | '';
