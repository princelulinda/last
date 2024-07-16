export interface Pagination {
  filters?: {
    limit?: number;
    offset?: number;
  };
}

export interface Favorite {
  merchant: string;
  merchant_action: string;
}
