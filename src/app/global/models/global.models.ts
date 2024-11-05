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
  | 'select-multiple'
  | 'autocomplete'
  | 'bool'
  | 'range'
  | 'lookup'
  | 'form_value'
  | null;

type FiltersDataModel =
  | null
  | 'None'
  | { url: string }
  | {
      choices: [{ title: string; value: string; selected?: boolean }];
    }
  | { field_type: number };

export interface FiltersModel {
  filters: {
    title: string;
    name: string;
    type: FiltersTypeModel;
    data: FiltersDataModel;
  }[];
  ordering: string[];
}
