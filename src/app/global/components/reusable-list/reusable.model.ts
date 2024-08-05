export interface PaginationModel {
  filters: {
    limit: number;
    offset: number;
  };
}

export interface ParamModel {
  title: string;
  value: string | null;
}
export interface getdataModal {
  objects: string;
  count: number;
  response_data: string;
  data_list: string;
  pages: number;
}
export interface selectedPeriodModel {
  endDate: string;
  startDate: string;
}
export interface Header {
  label: string;
  field: string[];
  size: string;
  format?: string;
  css?: string;
  class?: string;
  canBeDisplayed?: boolean;
}
