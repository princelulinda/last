export interface SimulateLoanModel {
  payment_number: number;
  amount: number;
  mode: string;
  interest_rate: string;
  period: number;
}

export interface PlanModel {
  crep_capital: string;
  crep_due_capital: string;
  crep_due_interest: string;
  crep_echeance_amount: number;
  crep_echeance_date: Date;
  crep_interest: string;
  crep_number: number;
  crep_status: {
    value: string;
    css: string;
    label: string;
  };
}

export interface SimulationResModel {
  amount: string;
  echeance_amount: number;
  exigible_amount: number;
  first_date: Date;
  interest_rate: string;
  payment_number: number;
  period: number;
  plan: PlanModel[];
  total_interests: string;
}

export interface ResponseDataModel {
  response_code: string;
  response_data: SimulationResModel;
  response_message: string;
  success: boolean;
}
