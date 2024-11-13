import { BankModel } from '../../core/db/models/bank/bank.model';
import { AccountsListModel } from '../account/models';
import { WalletModel } from '../wallet/wallet.models';

export interface AccountModel {
  account_holder: string;
}

export interface DebitOptionsModel {
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

export interface DebitModel {
  selectedDebitOption: 'account' | 'wallet';
  details: AccountsListModel | WalletModel;
  creditAccountType: string; // Ou le type approprié
  isTransferDone: boolean;
  isAmountChanging: boolean;
  selectedInstitutionType: string;
  selectedInstitution: InstitutionInfoModel | string; // Remplacez par le type approprié
}
export interface LookupDataModel {
  account_number: string | null | undefined;
  bank_slug: string | null | undefined;
  account_type: string | null | undefined;
}
export interface CreditDetailsModel {
  account: string;
  acc_holder: string;
  description: string | null | undefined;
  amount: number | string;
}
export interface DebitIndividualEventModel {
  account: string;
  creditAccountType?: string;
}
export interface SwitchBankEventModel {
  creditAccountType?: string;
  selectedDebitAccountType: string | null;
  debitAccount: string | null | DebitOptionsModel;
  debitWallet: string | null | DebitOptionsModel;
  banks: BankModel[];
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
export interface SelectedCreditAccountEventModel {
  transferForm: {
    accountNumber: string;
    accountHolder: string;
    debit_description: string;
    amount: number;
    merchant_reference?: string;
  };
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
