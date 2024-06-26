export interface TontineModel {
  name: string;
  members_count: number;
  short_description: string;
}
export interface SuggestedTontinesModel {
  id: number;
  name: string;
  members_count: number;
  membership_fees: number;
}
export interface TontineDataModele {
  name: string;
  members_count: number;
  penalities: number;
  mise_perso: number;
  contribution: number;
  preferences: string;
}
