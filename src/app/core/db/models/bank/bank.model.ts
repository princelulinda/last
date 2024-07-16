export interface bankModel {
  id: number;
  slug: string;
  bank_name: string;
  bank_type: string;
  bank_code: string;
  is_active: boolean;
  is_default: boolean;
  company: {
    about: string;
    fullname: string;
    id: number;
    image: string;
    logo: string;
    logo_icon: string;
    company_name: string;
    nickname: string;
    slug: string;
  };
}
