// Toasts Models
export interface ToastModel {
  active: boolean;
  message: string;
  title: string;
  type: toastTypeModel | '';
}

export interface ToastPaylodModel {
  message: string;
  title: string;
  type: toastTypeModel;
}
export type toastTypeModel = 'success' | 'failed' | 'info';

// Dialogs Models
export interface DialogModel {
  title: string;
  message: string;
  type: dialogTypeModel | '';
  action: string;
  active: boolean;
  image: string | '';
}

export interface DialogPayloadModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
  image?: string;
}

export type dialogTypeModel = 'confirm' | 'password' | 'pin';

export interface CloseDialog {
  response: string;
}

export interface DialogResponseModel {
  // response: string | { password: string } | { pin: string };
  response: {
    confirmation: 'YES' | 'NO' | '';
    password: string;
    pin: string;
  };
  action: string;
}

export interface LandscpeBillModel {
  printable_text: string;
  receipt_date: string | Date;
  logo_url: string;
}

export interface MerchantBillModel {
  name: string;
  debit_account: string;
  date: string;
  printable_text: string;
  merchantName: string;
  amount: string | number;
  code: string;
  product?: {
    name: string;
    value: string;
  };
  description: string;
  adress: string;
  credit_account: string;
}

export interface ObrBillModel {
  receipt_num: string;
  office: string;
  deliver_to: string;
  receipt_date: string | Date;
  nif: string;
  company: string;
  declarant_code: string;
  declarant_name: string;
  agence: string;
  ref: string;
  amount: string | number;
  name: string;
  type: string;
}

export interface TransfertBillModel {
  debit_account_holder: string;
  debit_account: string;
  debit_bank: string;
  credit_account_holder: string;
  credit_account: string;
  credit_bank: string;
  description: string;
  reference: string;
  bank_reference: string;
  amount: string;
  transfer_fees: string;
  bill_date: string | Date;
}
