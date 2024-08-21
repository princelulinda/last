export interface Pagination {
  filters?: {
    limit?: number | string;
    offset?: number | string;
  };
}

export interface Favorite {
  merchant: string;
  merchant_action: string;
}
