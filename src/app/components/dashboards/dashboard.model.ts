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

export interface MerchantLookup {
  id: number;
  lookup_title: string;
  lookup_image: string;
}

export interface bankModel {
  company: {
    image: string;
    fullname: string;
  };

  organization_id: number;
}

export interface PayMerchant {
  id: number;
}

export interface MenuGroup {
  icon: string;

  name: string;

  description: string;

  menus: Menu[] | null;

  is_active: boolean;
}

interface Menu {
  name: string;

  icon: string;

  link: string;
}
