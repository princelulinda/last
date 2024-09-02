export interface BankModel {
  id: number;
  slug: string;
  name: string;
  bank_type: string;
  bank_code: string;
  is_active: boolean;
  is_default: boolean;
  organization_id: number;
  swift_code: string | null;
  is_mappable: boolean;

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
