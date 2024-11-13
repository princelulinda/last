interface ClassModel {
  code: string;
  description: string;
  total: string;
}

export interface LedgerReportsModel {
  response_code: string;
  response_data: {
    left_hand: ClassModel[];
    right_hand: ClassModel[];
    result: string;
  };
  response_message: string;
  success: boolean;
}
