export interface PropertiesModel {
  accepts_simple_payment: boolean;
  client: number;
  merchant_category: number;
  merchant_code: string;
  merchant_logo: string;
  merchant_title: string;
  slug: string;
}

export interface GeometryModel {
  coordinates: number[];
  type: number;
}

export interface CoordsModel {
  geometry: GeometryModel;
  id: number;
  properties: PropertiesModel;
  type: string;
}

export interface Coords2Model {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}
