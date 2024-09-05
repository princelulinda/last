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
  accepts_reference_sys: boolean;
  members_counts: number;
  open_membership: boolean;
}
export interface AdhesionBodyModel {
  tontine: number;
  membre_client: number;

  reference_member: string;
  parts: number;
}
export interface AdhesionResponseModel {
  object: {
    response_message: string;

    success: boolean;
  };
}
