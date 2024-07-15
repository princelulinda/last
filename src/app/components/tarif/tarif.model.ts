export interface bankListResponse {
  id: number;
  isSelected: boolean;
  company: {
    name: string;
    logo: string;
  };
}
export interface tarifResponse {
  type_type: string;
  type_code: string;
  type_name: string;
  id: number;
  description: string;
}
export interface feesResonse {
  id: number;
  total_commission: number;
  agent_commission: number;
  amount_range: {
    lower: string;
    upper: string;
  };
}
export interface simulateResponse {
  total_commission: string;
  agent_commission: string;
  length: string;
}
