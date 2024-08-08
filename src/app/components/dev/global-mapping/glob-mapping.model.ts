export interface MobileBanksModel {
  name: string;
  company: {
    logo: string;
    name: string;
  };
}

export interface DebitOptionModel {
  account: string;
}
