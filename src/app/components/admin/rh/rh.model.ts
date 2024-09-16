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
