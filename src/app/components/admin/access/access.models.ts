export interface AccessModel {
  id: number;
  access_code: string;
  access_type: AccessTypeModel;
  access_type_list: AccessTypeModel[];
}

export type AccessTypeModel = 'execute' | 'validate' | 'authorize' | 'see';
