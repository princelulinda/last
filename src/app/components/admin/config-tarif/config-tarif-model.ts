export interface TarifTypeModel {
  type_type: string;
  type_code: string;
  type_name: string;
  id: string;
  description: string;
}
export interface TarifFeesResonseModel {
  objects: TarifFeesResonseModel;
  feesData: string;
  id: string;
  total_commission: string;
  agent_commission: string;
  ihela_commission: string;
  client_creation_commission: string;
  merchant_creation_commission: string;
  amount_range: {
    total_commission: string;
    lower: string;
    upper: string;
  };
}
export interface TarifTypeInfoModel {
  description: string;
  type_type: string;
  type_name: string;
}

export interface AddTarifModel {
  object: AddTarifModel;
  tarif: string;
  id: string;
}
export interface AddFeesModel {
  agent_commission: string;
  ihela_commission: string;
  total_commission: string;
  client_creation_commission: string;
  amount_range: {
    lower: string;
    upper: string;
  };

  fees: string;

  object: AddFeesModel;
}
// export interface AddTarifBodyModel{
// }
// export interface AddFeesBodyModel{
// }
export interface feesModel {
  id: string;
  amount_range: { lower: string; upper: string };
  total_commission: string;
  ihela_commission: string;
  agent_commission: string;
  client_creation_commission: string;
  merchant_creation_commission: string;
}
