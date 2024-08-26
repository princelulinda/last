export interface BankListResponseModel {
  id: number;
  isSelected: boolean;
  company: {
    name: string;
    logo: string;
  };
}
export interface TarifResponseModel {
  type_type: string;
  type_code: string;
  type_name: string;
  id: number;
  description: string;
}
export interface FeesResonseModel {
  id: number;
  total_commission: number;
  agent_commission: number;
  amount_range: {
    lower: string;
    upper: string;
  };
}
export interface SimulateResponseModel {
  total_commission: string;
  agent_commission: string;
  length: string;
}
