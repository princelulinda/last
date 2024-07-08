export interface BillersModel {
  lookup_image: string;
  lookup_title: string;
}

export interface MerchantModel {
  code: string;
  id: number;
  merchant_title: string;
}

export interface ProductModel {
  id: number;
  name: string;
  price: number;
  icon: string;
  merchant: MerchantModel;
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
