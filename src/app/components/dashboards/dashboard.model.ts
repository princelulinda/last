import { bankModel } from '../../core/db/models/bank/bank.model';
import { MerchantModel } from '../merchant/merchant.models';

export interface BillersModel {
  id: string;
  lookup_image: string;
  lookup_title: string;
  lookup_icon: string;
  icon: string;
  lookup_subtitle: string;
  is_favorite_merchant: boolean;
  success: string;
  merchant_category_name: string;
  accepts_simple_payment: boolean;
}

export interface objectsModel {
  objects: BillersModel[];
}

export interface objectModel {
  object: BillersModel;
}

export interface MerchantLookup {
  id: number;
  lookup_title: string;
  lookup_image: string;
}

export interface addBankResponse {
  object: {
    success: boolean;
    response_message: string;
    response_code: string;
  };
}

export interface PayMerchant {
  id: number;
}
export interface BankOptionsModel {
  selectedDebitAccountType: string | null;
  debitAccount: string | null;
  debitWallet: string | null;
  banks: bankModel[];
  creditAccountType: string | null;
  accounts: AccountInfoModel[] | null;
  wallets: WalletModel[] | null;
}
export interface AccountInfoModel {
  id: number;
  acc_number?: string;
  acc_holder?: string;
}

export interface WalletModel {
  id: number;
}
export interface MenuGroup {
  icon: string;

  name: string;

  description: string;

  menus: Menu[] | null;

  is_active: boolean;
}

export interface Menu {
  name: string;

  icon: string;

  link: string | string[];
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

export interface productCategoryModel {
  id: number;
  icon: string;
  image: string;
  is_active: true;
  name: string;
  ordering: number;
  slug: string;
  value_added_tax_rate: string;
}

export interface productCategoryArray {
  objects: productCategoryModel[];
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

export interface BestOfferModel {
  id: number;
  product: productOfferModel;
}

export interface productOfferModel {
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
