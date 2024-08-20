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
