export interface MetadataModel {
  name: string;
  field_name: string;
  meta_type: string;
  widget_attrs: {
    max_length: number;
    max_digits: number;
    required: boolean;
    choices: string;
  };
}
export interface MetadataCreationResponseModel {
  object: {
    response_message: string;

    success: boolean;
  };
}
export interface MetadataBodyModel {
  name: string | null | undefined;
  field_name: string | null | undefined;
  meta_type: string | null | undefined;
  widget_attrs: object;
}
export type WidgetAttrsModel = Record<string, string | number | boolean | null | undefined>;
