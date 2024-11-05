export interface ParamModel {
  title: string;
  value: string | null;
}
export interface getdataModel {
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

export interface ListHeadersModel {
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

export interface OverviewModel {
  label: string;
  value: string;
  value_data: {
    currency: string;
  } | null;
}
export interface DataListModel {
  value: string;
  size: string;
  css: string;
  icon: string;
  detail: string;
  boolean: boolean;
  format: string;
  class: string;
  canBeDisplayed: string;
  option1: string;
  option2: string;
  value1: string;
  value2: string;
}
