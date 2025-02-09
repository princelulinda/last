export interface AutocompleteModel {
  id: number;
  lookup_icon: string | null;
  lookup_image: string | null;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string | null;
  lookup_has_image_or_icon: boolean;
}

export interface LookupModel {
  id: number;
  lookup_icon: string | null;
  lookup_image: string | null;
  lookup_title: string;
  lookup_subtitle: string;
  lookup_description: string | null;
  lookup_has_image_or_icon: boolean;
}

export type CurrencyModel = 'BIF' | '$';

type FiltersTypeModel =
  | 'select'
  | 'select_multiple'
  | 'autocomplete'
  | 'bool'
  | 'range'
  | 'date'
  | 'lookup'
  | 'form_value'
  | null;

export interface FiltersModel {
  filters: {
    title: string;
    name: string;
    type: FiltersTypeModel;
    data: {
      url?: string;
      choices?: { title: string; value: string; selected?: boolean }[];
      field_type?: string;
      min?: number;
      max?: number;
      step?: number;
    } | null;
  }[];
  ordering: string[];
}
