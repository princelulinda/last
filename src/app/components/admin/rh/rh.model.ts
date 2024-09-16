export interface AdminDepartementsDetailsModel {
  object: {
    name: string;
  };
}
export interface AdminDirectionsDetailsModel {
  object: {
    name: string;
    direction_type: {
      title: string;
    };
  };
}
export interface AdminServicesDetailsModel {
  department: string;
  id: string;

  object: {
    service_alpha_code: string;
    name: string;
    direction_type: string;
  };
}

export interface AdminCreateNewDepartmentModel {
  object: AdminCreateNewDepartmentModel;
}
export interface CreateNewDirectionModel {
  object: CreateNewDirectionModel;
  directionsData: string;
}
export interface CreateNewServiceModel {
  object: CreateNewServiceModel;
}

export interface AdminCreateNewDepartmentBodyModel {
  name: string | null | undefined;
  direction: string | null | undefined;
}
export interface CreateNewDirectionBodyModel {
  name: string | null | undefined;
  direction_type: string | null | undefined;
}
export interface CreateNewServiceBodyModel {
  name: string | null | undefined;
  department: string | null | undefined;
  disallow_connexion: boolean;
}
