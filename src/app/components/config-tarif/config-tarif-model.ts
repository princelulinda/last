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
export interface AddTarifBodyModel {
  type_type: string | undefined;
  name: string | null | undefined;
  type_code: string | null | undefined;
  description: string | null | undefined;
}
export interface ModifyFeesBodyModel {
  tarif_table: string;
  amount_range: {
    lower: string | null | undefined;
    upper: string | null | undefined;
    bounds: string;
  };
  commissions: string | null | undefined;
  ihela_cios: string | null | undefined;
  description: string;
}
export interface ModifyFeesModel {
  object: ModifyFeesModel;
  fees: string;
}
export interface AddFeesModel {
  // response_message: string;
  // agent_commission: string;
  // ihela_commission: string;
  // total_commission: string;
  // client_creation_commission: string;
  // amount_range: {
  //   lower: string;
  //   upper: string;
  // };

  fees: string;

  object: AddFeesModel;
}
export interface AddFeesBodyModel {
  tarif_table: string;
  amount_range: {
    lower: string | null | undefined;
    upper: string | null | undefined;
    bounds: string;
  };
  commissions: string | null | undefined;
  ihela_cios: string | null | undefined;
  description: string;
}
export interface addTarifToTableBodyModel {
  tarif_type: string;
  bank: string;
}
export interface feesModel {
  id: string;
  amount_range: { lower: string; upper: string };
  total_commission: string;
  ihela_commission: string;
  agent_commission: string;
  client_creation_commission: string;
  merchant_creation_commission: string;
}
export interface deleteFeesModel {
  object: deleteFeesModel;
}
