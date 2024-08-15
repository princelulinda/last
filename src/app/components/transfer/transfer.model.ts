import { bankModel } from '../../core/db/models/bank/bank.model';
import { FormGroup } from '@angular/forms';
export interface Account {
  account_holder: string;
}

export interface DebitOptions {
  id?: string;
  lookup_title?: string;
  lookup_sub_title?: string;
  account: string;
  wallet: string;
  selectedDebitOption: string;
  creditAccountType: string;
  isTransferDone: boolean;
  isAmountChanging: boolean;
  selectedInstitutionType: string;
  selectedInstitution: string | InstitutionInfoModel;
  acc_get_title?: string;

  acc_short_number?: string;
  acc_holder?: string;
  acc_available_balance?: number;
  available_balance?: number;
  acc_currency?: string;
  currency?: string;

  title?: string;
}
export interface MerchantInfoModel {
  object: {
    success: boolean;
  };
}
export interface LookupData {
  account_number: string | null | undefined;
  bank_slug: string | null | undefined;
  account_type: string | null | undefined;
}
export interface CreditDetail {
  account: string;
  acc_holder: string;
  description: string | null | undefined;
  amount: number | string;
}
export interface DebitEvent {
  account: string;
  creditAccountType?: string;
}
export interface SwitchBankEvent {
  creditAccountType?: string;
  selectedDebitAccountType: string | null;
  debitAccount: string | null | DebitOptions;
  debitWallet: string | null | DebitOptions;
  banks: bankModel[];
}

export interface LookupResponseModel {
  id?: number;
  lookup_title?: string;
  lookup_image?: string;
  account_number?: string;
  bank_slug?: string;
  account_type?: string;
}
export interface TransferResponseModel {
  object: {
    success: boolean;
    response_message: string;
    response_code: string;
    response_data: CreditAccountModel;
  };
  bank_reference: string;
  reference: string;
}
export interface CreditAccountModel {
  name: string;
  account_number: string;
}
export interface DebitAccountModel {
  acc_short_number: string | number;
  acc_bank_id: string | number;
  acc_branch_object: {
    organization_tenant: {
      institution_client: {
        client_full_name: string;
      };
    };
  };
  acc_holder: string | number;
}
export interface SelectedCreditAccountEvent {
  transferForm: FormGroup;
  selectedInstitution: InstitutionInfoModel;
  selectedCreditAccountType: string;
}
export interface DebitWalletModel {
  code: string | number;
  account: {
    account_holder: string;
  };
  bank_id: string | number;
}
export interface InstitutionInfoModel {
  id: number | string;
  name: string;
  company: {
    logo: string;
    name: string;
    fullname: string;
  };
  api_values: {
    has_lookup: boolean;
  };
  slug: string;
}
export interface AmountEventModel {
  amount: number | null;
}
export interface PopupEventModel {
  isPopupShown: boolean;
}
export interface DebitEventModel {
  account: DebitAccountModel;
  wallet: DebitWalletModel;
  selectedDebitOptions: DebitAccountModel | string;
  isTransferDone: boolean;
  isAmountChanging: boolean;
  selectedInstitutionType: string | InstitutionInfoModel;
  creditAccountType: string | CreditAccountModel | InstitutionInfoModel;

  selectedInstitution: InstitutionInfoModel[];
}
