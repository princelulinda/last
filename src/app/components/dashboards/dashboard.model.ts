import { BankModel } from '../../core/db/models/bank/bank.model';
import { MerchantModel } from '../merchant/merchant.models';
import { WalletModel } from '../wallet/wallet.models';

export interface addBankResponse {
  object: {
    success: boolean;
    response_message: string;
    response_code: string;
  };
}

export interface BankOptionsModel {
  selectedDebitAccountType: string | null;
  debitAccount: string | null;
  debitWallet: string | null;
  banks: BankModel[];
  creditAccountType: string | null;
  accounts: AccountInfoModel[] | null;
  wallets: WalletModel[] | null;
}
export interface AccountInfoModel {
  id: number;
  acc_number?: string;
  acc_holder?: string;
}

export interface PublisherModel {
  client_full_name: string;
  picture: string;
  id: number;
}

export interface DocumentModel {
  docfile: string;
}

export interface CategoryModel {
  created_at: string;
  id: number;
  name: string;
}

export interface PublicationModel {
  caption: string;
  category: CategoryModel;
  documents: DocumentModel[];
  publishers: PublisherModel[];
  total_reactions: number;
  total_replies: number;
  total_shares: number;
}

export interface ProductCategoryModel {
  id: number;
  icon: string;
  image: string;
  is_active: true;
  name: string;
  ordering: number;
  slug: string;
  value_added_tax_rate: string;
}

export interface StatModel {
  agents_number: number;
  clients_created: number;
  merchants_number: number;
}

export interface StatResModel {
  response_code: number;
  response_data: StatModel;
  response_message: string;
  success: boolean;
}

export interface SessionName {
  username: string;
}

export interface SessionIP {
  ip_address: string;
}

export interface SessionToShow {
  session_duration: string;
  ip_address: SessionIP;
  user: SessionName;
}

export interface ProductOfferModel {
  id: number;
  name: string;
  price: string;
  merchant: MerchantModel;
}
export interface RecentTransaction {
  id: number;
  name: string;
  price: string;
  merchant: MerchantModel;
}
