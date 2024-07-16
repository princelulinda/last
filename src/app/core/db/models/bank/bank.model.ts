export interface bankModel {
  id: number;
  slug: string;
  name: string;
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
    name: string;
    nickname: string;
    slug: string;
  };
}
