export interface TransactionToTellerModel {
  password: string;
  teller: number;
  teller_destination: number;
  description: string;
  notes: {
    bank_note: number;
    number: number;
  }[];
}

export interface TransactionResModel {
  success: boolean;
  response_code: string;
  response_message: string;
  response_data: {
    created_at: string;
  };
}
