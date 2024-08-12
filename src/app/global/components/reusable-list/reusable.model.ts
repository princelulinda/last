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
  field: string[];
  css?: string;
  icon?: string;
  detail?: {
    link: string;
    field: string;
  };
  boolean?: boolean;
  class?: string;
  size?: string;
  format?: string;
  canBeDisplayed?: boolean;
  option1?: string;
  option2?: string;
  value1?: string;
  value2?: string;

  name: string;
}
