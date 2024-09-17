export interface AccessModel {
  id: number;
  access_code: string;
  access_type: 'execute' | 'validate' | 'authorize' | 'see';
  access_type_list: [];
}
