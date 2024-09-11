export interface TarifTypeModel {
  type_type: string;
  type_code: string;
  type_name: string;
  id: string;
  description: string;
}
export interface TarifFeesResonseModel {
  feesData: string;
  id: string;
  total_commission: string;
  agent_commission: string;
  ihela_commission: string;
  client_creation_commission: string;
  merchant_creation_commission: string;
  amount_range: {
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
// export interface EventTargetModel{
//   target:string;
// }
