import { bankModel } from '../../core/db/models/bank/bank.model';

export interface Account {
  account_holder: string;
}

export interface DebitOptions {
  id?: string;
  lookup_title?: string;
  lookup_sub_title?: string;
  account: Account | null;
  wallet: string | null;
  selectedDebitOption: string;
  creditAccountType: string | null;
  isTransferDone: boolean;
  isAmountChanging: boolean;
  selectedInstitutionType: string;
  selectedInstitution: string;
  acc_get_title?: string;

  acc_short_number?: string;
  acc_holder?: string;
  acc_available_balance?: number;
  available_balance?: number;
  acc_currency?: string;
  currency?: string;

  title?: string;
}

export interface DebitEvent {
  account: Account | null;
  creditAccountType: string | null;
}
export interface SwitchBankEvent {
  creditAccountType: string | null;
  selectedDebitAccountType: string | null;
  debitAccount: string | null | DebitOptions;
  debitWallet: string | null | DebitOptions;
  banks: bankModel[];
}
