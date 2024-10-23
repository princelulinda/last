interface ClassModel {
  code: string;
  description: string;
  total: string;
}

export interface BalanceSheetModel {
  left_hand: ClassModel[];
  right_hand: ClassModel[];
  result: string;
}

export interface BilanResponseModel {
  response_code: string;
  response_data: BalanceSheetModel;
  response_message: string;
  success: boolean;
}
